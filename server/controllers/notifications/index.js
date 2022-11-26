const {
  notifications,
  notificationsByUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} = require('./notifications');

const notificationsResolvers = {
  notificationQuery: {
    notifications,
    notificationsByUser,
  },
  notificationMutation: {
    markAllNotificationsAsRead,
    markNotificationAsRead,
  },
};

module.exports = notificationsResolvers;
