const {
  chats,
  chatById,
  chatByUser,
  postMessage,
  markMessageAsRead,
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
    markMessageAsRead,
  },
  messageSubscription: {
    newMessageSubscription,
  },
};

module.exports = messagesResolvers;
