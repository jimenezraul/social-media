const { userQuery, userMutation } = require("./users");
const { postQuery, postMutation } = require("./posts");

const resolvers = {
  Query: {
    ...userQuery,
    ...postQuery,
  },
  Mutation: {
    ...userMutation,
    ...postMutation,
  },
};

module.exports = resolvers;
