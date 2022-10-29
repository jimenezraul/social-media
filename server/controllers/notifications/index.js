const { notifications, notificationsByUser } = require('./notifications');

const notificationsResolvers = {
  notificationQuery: {
    notifications,
    notificationsByUser,
  },
};

module.exports = notificationsResolvers;