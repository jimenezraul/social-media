const { userQuery, userMutation } = require('../controllers/users');
const { postQuery, postMutation, postSubscription } = require('../controllers/posts');

const resolvers = {
  Query: {
    ...userQuery,
    ...postQuery,
  },
  Mutation: {
    ...userMutation,
    ...postMutation,
  }
};

module.exports = resolvers;
