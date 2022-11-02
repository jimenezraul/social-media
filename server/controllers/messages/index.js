const {
  chats,
  chatById,
  chatByUser,
  postMessage,
  newMessageSubscription,
} = require('./messages');

const messagesResolvers = {
  messageQuery: {
    chats,
    chatById,
    chatByUser,
  },
  messageMutation: {
    postMessage,
  },
  messageSubscription: {
    newMessageSubscription,
  },
};

module.exports = messagesResolvers;
