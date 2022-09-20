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
      success: true,
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

    if (user.friends.includes(friendId)) {
      throw new AuthenticationError("You are already friends");
    }
    
    const userReq = [
      {
        _id: context.user._id,
        method: { $pull: { friendRequests: friendId } },
      },
      {
        _id: context.user._id,
        method: { $push: { friends: friendId } },
      },
      {
        _id: friendId,
        method: { $push: { friends: context.user._id } },
      },
    ];

    userReq.forEach(async (req) => {
      console.log(req);
      await User.findOneAndUpdate({ _id: req._id }, req.method, {
        new: true,
      });
    });

    return {
      success: true,
      message: "Friend request accepted successfully",
    };
  },
};
