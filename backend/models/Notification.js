import mongoose from 'mongoose';

export const NOTIFICATION_TYPES = [
  'order_placed',
  'order_status',
  'order_cancelled',
  'new_order',
  'new_product',
  'product_submitted',
  'product_sold',
  'seller_request',
  'seller_approved',
  'seller_rejected',
  'low_stock',
  'product_status',
  'contact_message',
  'system',
];

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
      default: 'system',
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    body: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },
    // In-app route the notification deep-links to, e.g. '/orders/66a...'.
    link: {
      type: String,
      default: '',
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// The bell only ever renders "latest N for this user, newest first".
notificationSchema.index({ user: 1, createdAt: -1 });
// Keeps the unread badge lookup cheap.
notificationSchema.index({ user: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
