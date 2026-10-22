const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['status_update', 'application_received', 'ai_completed', 'general'],
      default: 'status_update'
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
