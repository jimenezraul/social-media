const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");

module.exports = {
  me: async (parent, args, context) => {
    if (context.user) {
      const userData = await User.findOne({ _id: context.user._id })
        .select("-__v -password")
        .populate("posts");

      return userData;
    }

    throw new AuthenticationError("Not logged in");
  },
  users: async () => {
    return User.find().select("-__v -password").populate("posts");
  },
  user: async (parent, { id }) => {
    return User.findOne({ _id: id }).select("-__v -password").populate("posts");
  },
};
