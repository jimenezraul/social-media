const { GraphQLError } = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const { Notification } = require('../../models');

const pubsub = new PubSub();

module.exports = {
  // get all notifications
  notifications: async (parent, args, context) => {
    if (!context.user) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }
    return Notification.find()
      .select('-__v')
      .populate({
        path: 'members',
        select: '-__v -password',
      })
      .populate({
        path: 'notifications',
        populate: [
          {
            path: 'sender',
            model: 'User',
          },
        ],
      });
  },
  // get all notifications by user id
  notificationsByUser: async (parent, args, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const notifications = await Notification.find({
      recipient: loggedUser._id,
      is_read: false,
    })
      .populate({
        path: 'sender',
        select: '-__v -password',
      })
      .populate({
        path: 'recipient',
        select: '-__v -password',
      });

    return notifications;
  },
  // mark all notifications by user as read
  markAllNotificationsAsRead: async (parent, { userId }, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const notifications = await Notification.find({
      recipient: userId,
      is_read: false,
    });

    if (!notifications) {
      return {
        success: false,
        message: 'No notifications found',
      };
    }

    notifications.forEach(async (notification) => {
      notification.is_read = true;
      await notification.save();
    });

    return {
      success: true,
      message: 'All notifications marked as read',
    };
  },
  // mark notification as read
  markNotificationAsRead: async (parent, { notificationId }, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const notification = await Notification.findOne({
      _id: notificationId,
    });

    if (!notification) {
      return {
        success: false,
        message: 'Notification not found',
      };
    }

    notification.is_read = true;
    await notification.save();

    return {
      success: true,
      message: 'Notification marked as read',
    };
  },
};
