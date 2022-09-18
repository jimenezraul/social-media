const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");

module.exports = {
  // friend request
  friendRequest: async (parent, args, context) => {
    const { friendId } = args;

    if (!context.user) {
      throw new AuthenticationError("You need to be logged in!");
    }

    const user = await User.findOne({ _id: context.user._id });

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    if (user.friendRequests.includes(friendId)) {
      throw new AuthenticationError("You have already sent a friend request");
    }

    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $push: { friendRequests: friendId } },
      { new: true }
    );

    return {
      message: "Friend request sent successfully",
    };
  },

  // accept friend request
  acceptFriendRequest: async (parent, args, context) => {
    const { friendId } = args;

    if (!context.user) {
      throw new AuthenticationError("You need to be logged in!");
    }

    const user = await User.findOne({ _id: context.user._id });

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    if (!user.friendRequests.includes(friendId)) {
        throw new AuthenticationError("You have not received a friend request");
    }

    // remove friend request from the friend request array
    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $pull: { friendRequests: friendId } },
      { new: true }
    );

    // add friend to my friends array
    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $push: { friends: friendId } },
      { new: true }
    );

    // add me to my friend's friends array
    await User.findOneAndUpdate(
      { _id: friendId },
      { $push: { friends: context.user._id } },
      { new: true }
    );

    return {
      message: "Friend request accepted successfully",
    };
  },
};
