const { messages, message, messagesByUser } = require('./messages');

const messagesResolvers = {
  messageQuery: {
    messages,
    message,
    messagesByUser,
  },
};

module.exports = messagesResolvers;