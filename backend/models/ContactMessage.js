import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      maxlength: [254, 'Email cannot exceed 254 characters'],
    },
    phone: {
      type: String,
      default: '',
      trim: true,
      maxlength: [15, 'Phone cannot exceed 15 characters'],
    },
    subject: {
      type: String,
      default: 'General enquiry',
      trim: true,
      maxlength: [120, 'Subject cannot exceed 120 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
  },
  { timestamps: true }
);

contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;