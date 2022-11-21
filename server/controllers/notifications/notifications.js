const {
  AuthenticationError,
  ForbiddenError,
} = require('@apollo/server');
const {PubSub} = require('graphql-subscriptions');
const {notifications} = require('../../models');

const pubsub = new PubSub();

module.exports = {
  // get all notifications
  notifications: async (parent, args, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
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
  notificationsByUser: async (parent, { userId }, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new AuthenticationError('You need to be logged in!');
    }
    return Notification.findOne({ recipient: userId })
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
};
