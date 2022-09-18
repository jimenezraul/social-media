const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");

module.exports = {
  // Query for current user
  me: async (parent, args, context) => {
    if (context.user) {
      const userData = await User.findOne({ _id: context.user._id })
        .select("-__v -password")
        .populate("posts")
        .populate("friends")
        .populate("friendRequests");

      return userData;
    }

    throw new AuthenticationError("Not logged in");
  },
  // Query for all users
  users: async () => {
    return User.find().select("-__v -password").populate("posts");
  },
  // Query for a single user by id
  user: async (parent, { id }) => {
    return User.findOne({ _id: id }).select("-__v -password").populate("posts");
  },
};
