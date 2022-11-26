const {
  userQuery,
  userMutation,
  userSubscription,
} = require('../controllers/users');
const {
  postQuery,
  postMutation,
  postSubscription,
} = require('../controllers/posts');
const {
  messageQuery,
  messageMutation,
  messageSubscription,
} = require('../controllers/messages');
const {
  notificationQuery,
  notificationMutation,
  notificationSubscription,
} = require('../controllers/notifications');

const resolvers = {
  Query: {
    ...userQuery,
    ...postQuery,
    ...messageQuery,
    ...notificationQuery,
  },
  Mutation: {
    ...userMutation,
    ...postMutation,
    ...messageMutation,
    ...notificationMutation,
  },
  Subscription: {
    ...postSubscription,
    ...userSubscription,
    ...messageSubscription,
  },
};

module.exports = resolvers;
