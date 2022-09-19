const { userQuery, userMutation } = require("./user");
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
