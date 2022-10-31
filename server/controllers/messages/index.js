const {
  messages,
  message,
  messagesByUser,
  postMessage,
  newMessageSubscription,
} = require('./messages');

const messagesResolvers = {
  messageQuery: {
    messages,
    message,
    messagesByUser,
  },
  messageMutation: {
    postMessage,
  },
  messageSubscription: {
    newMessageSubscription,
  },
};

module.exports = messagesResolvers;
