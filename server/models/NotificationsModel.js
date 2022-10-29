const { Schema, model } = require('mongoose');

const notificationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  {
    timestamps: true,
  }
);

const NotificationsModel = model('Notification', notificationSchema);

module.exports = NotificationsModel;
