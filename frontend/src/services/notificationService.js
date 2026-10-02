import api from './api.js';

/**
 * List the authenticated user's notifications (newest first).
 * Pass { unread: true } to only fetch unread items.
 */
export const fetchNotifications = async({ limit = 20, unread = false } = {}) => {
  const { data } = await api.get('/notifications', {
    params: { limit, ...(unread ? { unread: 'true' } : {}) },
  });
  return data.data;
};

/**
 * Lightweight unread tally for the bell badge.
 */
export const fetchUnreadCount = async() => {
  const { data } = await api.get('/notifications/unread-count');
  return data.data.unreadCount;
};

/**
 * Mark one notification as read. Returns the updated notification and the
 * server's authoritative unread count, so the badge never drifts.
 */
export const markNotificationRead = async(id) => {
  const { data } = await api.patch(`/notifications/${id}`);
  return data.data;
};

export const markAllNotificationsRead = async() => {
  const { data } = await api.patch('/notifications/read-all');
  return data.data;
};

export const clearNotifications = async() => {
  const { data } = await api.delete('/notifications');
  return data.data;
};
