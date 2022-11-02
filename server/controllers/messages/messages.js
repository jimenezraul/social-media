const {
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { Message } = require('../../models');

module.exports = {
  // get all chats
  chats: async (parent, args, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    const messages = await Message.find()
      .select('-__v')
      .populate({
        path: 'members',
        select: '-__v -password',
        model: 'User',
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

    return messages;
  },

  // get a single chat by id
  chatById: async (parent, { id }, context) => {
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
  chatByUser: async (parent, args, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new AuthenticationError('You need to be logged in!');
    }

    const chats = await Message.find({
      members: { $in: [loggedUser._id] },
    })
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

    return chats;
  },

  // post a message
  postMessage: async (parent, { recipientId, text, media }, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new AuthenticationError('You need to be logged in!');
    }

    // gets messages that have loggedUser and recipient if they exist else creates a new message
    const message = await Message.findOneAndUpdate(
      {
        members: { $all: [loggedUser._id, recipientId] },
      },
      {
        $push: {
          messages: {
            sender: loggedUser._id,
            text,
            media,
          },
        },
      },
      {
        new: true,
        upsert: true,
      }
    )
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

    if (message) {
      pubsub.publish('NEW_MESSAGE', { newMessageSubscription: message });
      return message;
    }

    const newMessage = await Message.create({
      members: [loggedUser._id, recipientId],
      messages: {
        sender: loggedUser._id,
        text,
        media,
      },
    })
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

    pubsub.publish('NEW_MESSAGE', { newMessageSubscription: newMessage });
    return newMessage;
  },

  newMessageSubscription: {
    subscribe: () => pubsub.asyncIterator('message'),
  },
};