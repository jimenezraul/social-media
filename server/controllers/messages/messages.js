const { GraphQLError } = require('graphql');
const { PubSub, withFilter } = require('graphql-subscriptions');
const { Message, User } = require('../../models');

const pubsub = new PubSub();

module.exports = {
  // get all chats
  chats: async (parent, args, context) => {
    if (!context.user) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    // check if logged user is a member of the chat
    const chat = await Message.findOne({
      members: { $all: [loggedUser._id, recipientId] },
    });

    if (chat) {
      // gets messages that have loggedUser and recipient if they exist else creates a new message
      const message = await Message.findOneAndUpdate(
        {
          members: { $all: [loggedUser._id, recipientId] },
        },
        {
          members: [loggedUser._id, recipientId],
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

      const sender = await User.findOne({ _id: loggedUser._id });
      const filteredMessages = sender.messages.filter((message) => {
        return message._id.toString() !== chat._id.toString();
      });
      sender.messages = [message, ...filteredMessages];
      await sender.save();

      const recipient = await User.findOne({ _id: recipientId });
      const filteredRecipientMessages = recipient.messages.filter((message) => {
        return message._id.toString() !== chat._id.toString();
      });
      recipient.messages = [message, ...filteredRecipientMessages];
      await recipient.save();

      if (message) {
        pubsub.publish('NEW_MESSAGE', { newMessageSubscription: message });
        return message;
      }
    }

    const createMessage = await Message.create({
      members: [loggedUser._id, recipientId],
      messages: {
        sender: loggedUser._id,
        text,
        media,
      },
    });

    const newMessage = await Message.findOne({
      _id: createMessage._id,
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

    // update loggedUser and recipient's messages
    const sender = await User.findOne({ _id: loggedUser._id });
    sender.messages.unshift(createMessage._id);
    await sender.save();

    const recipient = await User.findOne({ _id: recipientId });
    recipient.messages.unshift(createMessage._id);
    await recipient.save();

    pubsub.publish('NEW_MESSAGE', { newMessageSubscription: newMessage });

    return newMessage;
  },

  // mark a message as read
  markMessageAsRead: async (parent, { messageId }, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    // change status from delivered to read
    const message = await Message.findOneAndUpdate(
      {
        _id: messageId,
      },
      {
        $set: {
          'messages.$[elem].status': 'read',
        },
      },
      {
        arrayFilters: [{ 'elem.status': 'delivered' }],
        new: true,
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
  },

  getMessagesById: async (parent, { id, limit }, context) => {
    const loggedUser = context.user;
    if (!loggedUser) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }
  
    const message = await Message.findOne({
      _id: id,
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

    if (limit) {
      const messages = message.messages.slice(-limit);
      message.messages = messages;
    }

    if (message) {
      return [message];
    }
  },

  newMessageSubscription: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('NEW_MESSAGE'),
      (payload, variables) => {
        const userExists = payload.newMessageSubscription.members.find(
          (member) => member._id.toString() === variables.userId
        );

        return !!userExists;
      }
    ),
  },
};
