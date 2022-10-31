const {
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');
const {PubSub} = require('graphql-subscriptions');
const {Message} = require('../../models');


module.exports = {
  // get all messages
  messages: async (parent, args, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }
    return Message.find()
      .select('-__v')
      .populate({
        path: 'members',
        select: '-__v -password',
      })
      .populate({
        path: 'messages',
        populate: [
          {
            path: 'sender',
            model: 'User',
          },
        ],
      });
  },
  // get a single message by id
  message: async (parent, { id }, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new AuthenticationError('You need to be logged in!');
    }
    return Message.findOne({ _id: id })
      .select('-__v')
      .populate({
        path: 'members',
        select: '-__v -password',
      })
      .populate({
        path: 'messages',
        populate: [
          {
            path: 'sender',
            model: 'User',
          },
        ],
      });
  },
  // get all messages by user id
  messagesByUser: async (parent, { userId }, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new AuthenticationError('You need to be logged in!');
    }
    return Message.findOne({ members: userId })
      .select('-__v')
      .populate({
        path: 'members',
        select: '-__v -password',
      })
      .populate({
        path: 'messages',
        populate: [
          {
            path: 'sender',
            model: 'User',
          },
        ],
      });
  },
  // post a message
  postMessage: async (parent, { message }, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new AuthenticationError('You need to be logged in!');
    }
    const newMessage = await Message.create({
      ...message,
      sender: loggedUser._id,
    });
    pubsub.publish('messagePosted', { messagePosted: newMessage });
    return newMessage;
  },
  

  newMessageSubscription: {
    subscribe: () => pubsub.asyncIterator('message'),
  },

};
