const {
  chats,
  chatById,
  chatByUser,
  postMessage,
  markMessageAsRead,
  getMessagesById,
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
    getMessagesById,
  },
  messageSubscription: {
    newMessageSubscription,
  },
};

module.exports = messagesResolvers;
