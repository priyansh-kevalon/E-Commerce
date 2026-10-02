import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

const toClient = (notification) => ({
  id: notification._id,
  type: notification.type,
  title: notification.title,
  body: notification.body,
  link: notification.link,
  read: notification.read,
  createdAt: notification.createdAt,
});

/**
 * Create notifications without ever letting a notification failure break the
 * request that triggered it (order placement, status change, ...). Callers
 * deliberately do not await this.
 */
export const createNotification = async ({ user, type, title, body = '', link = '' }) => {
  const recipients = (Array.isArray(user) ? user : [user]).filter(Boolean);
  if (!recipients.length) return [];

  try {
    const docs = await Notification.insertMany(
      recipients.map((recipient) => ({
        user: recipient,
        type,
        title,
        body,
        link,
      }))
    );
    return docs.map(toClient);
  } catch (error) {
    console.error('[notification] failed to create:', error.message);
    return [];
  }
};

/**
 * Fan a notification out to every active user. Used for storefront-wide
 * announcements (e.g. a newly published product).
 *
 * `exclude` skips the actor so an admin does not get told about their own
 * upload. Inactive/banned accounts are skipped too - they cannot sign in, so a
 * notification would be invisible to them and would just bloat the collection.
 */
/**
 * Resolve an audience from a User filter and fan a notification out to them.
 * Shared by the storefront-wide and role-scoped broadcasts below.
 */
const fanOut = async (filter, { type, title, body, link }) => {
  try {
    const User = (await import('../models/User.js')).default;

    const recipients = await User.find(filter).select('_id').lean();
    if (!recipients.length) return [];

    const ids = recipients.map((entry) => entry._id);
    const created = [];

    // Chunked so a large user base can't turn one insert into a single
    // oversized (and slow) write.
    const CHUNK = 500;
    for (let i = 0; i < ids.length; i += CHUNK) {
      const batch = ids.slice(i, i + CHUNK);
      // Sequential on purpose: this runs after the response and we would rather
      // not pile up parallel writes against the same collection.
      // eslint-disable-next-line no-await-in-loop
      created.push(
        ...(await createNotification({
          user: batch,
          type,
          title,
          body,
          link,
        }))
      );
    }

    console.log(`[notification] "${type}" sent to ${created.length} user(s)`);
    return created;
  } catch (error) {
    console.error('[notification] broadcast failed:', error.message);
    return [];
  }
};

/**
 * Fan a notification out to every active user. Used for storefront-wide
 * announcements (e.g. a newly published product).
 *
 * `exclude` skips the actor so an admin does not get told about their own
 * upload. Inactive/banned accounts are skipped too - they cannot sign in, so a
 * notification would be invisible to them and would just bloat the collection.
 */
export const notifyAllUsers = ({ exclude, ...payload }) =>
  fanOut(
    {
      isActive: { $ne: false },
      ...(exclude ? { _id: { $ne: exclude } } : {}),
    },
    payload
  );

/**
 * Fan a notification out to every active user holding a given role. Used for
 * internal workflow prompts, e.g. telling admins a seller product is waiting
 * for approval.
 */
export const notifyRole = ({ role, exclude, ...payload }) =>
  fanOut(
    {
      role,
      isActive: { $ne: false },
      ...(exclude ? { _id: { $ne: exclude } } : {}),
    },
    payload
  );

export const getNotifications = async (req, res, next) => {
  try {
    const requested = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requested)
      ? Math.min(Math.max(requested, 1), MAX_LIMIT)
      : DEFAULT_LIMIT;

    const filter = { user: req.user._id };
    if (req.query.unread === 'true') filter.read = false;

    const [items, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      Notification.countDocuments({ user: req.user._id, read: false }),
    ]);

    return successResponse(res, 'Notifications fetched successfully', {
      notifications: items.map(toClient),
      unreadCount,
    });
  } catch (error) {
    return next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });
    return successResponse(res, 'Unread count fetched successfully', { unreadCount });
  } catch (error) {
    return next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const result = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true, readAt: new Date() },
      { new: true }
    ).lean();

    if (!result) {
      return errorResponse(res, 'Notification not found', 404);
    }

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    return successResponse(res, 'Notification marked as read', {
      notification: toClient(result),
      unreadCount,
    });
  } catch (error) {
    return next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );
    return successResponse(res, 'All notifications marked as read', { unreadCount: 0 });
  } catch (error) {
    return next(error);
  }
};

export const clearAll = async (req, res, next) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    return successResponse(res, 'Notifications cleared', { unreadCount: 0 });
  } catch (error) {
    return next(error);
  }
};
