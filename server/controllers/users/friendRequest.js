const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../../models');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
  // friend request
  friendRequest: async (parent, args, context) => {
    const { friendId } = args;

    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    const user = await User.findOne({ _id: friendId }).select('-__v -password');
    const friend = await User.findOne({ _id: context.user._id }).select(
      '-__v -password'
    );
     
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (user.friendRequests.includes(context.user._id)) {
      user.friendRequests.pull(context.user._id);
      user.friendRequestCount -= 1;
      user.save();

      pubsub.publish('NEW_FRIEND_REQUEST', {
        newFriendRequestSubscription: {
          friendId: friendId,
          user: friend,
          requestExists: false,
        },
      });

      return {
        success: true,
        message: 'Friend request removed',
      };
    }

    user.friendRequests.push(context.user._id);
    user.friendRequestCount = user.friendRequestCount + 1;
    user.save();

    pubsub.publish('NEW_FRIEND_REQUEST', {
      newFriendRequestSubscription: {
        friendId: friendId,
        user: friend,
        requestExists: true,
      },
    });

    return {
      success: true,
      message: 'Friend request sent successfully',
    };
  },

  // accept friend request
  acceptFriendRequest: async (parent, args, context) => {
    const { friendId } = args;

    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    const user = await User.findOne({ _id: context.user._id });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (!user.friendRequests.includes(friendId)) {
      throw new AuthenticationError('You have not received a friend request');
    }

    if (user.friends.includes(friendId)) {
      throw new AuthenticationError('You are already friends');
    }

    user.friendRequestCount -= 1;
    user.save();

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
      await User.findOneAndUpdate({ _id: req._id }, req.method, {
        new: true,
      });
    });

    return {
      success: true,
      message: 'Friend request accepted successfully',
    };
  },

  // remove friend
  removeFriend: async (parent, args, context) => {
    const { friendId } = args;

    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    const user = await User.findOne({ _id: context.user._id });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (!user.friends.includes(friendId)) {
      throw new AuthenticationError('You are not friends');
    }

    user.friends.pull(friendId);
    user.save();

    return {
      success: true,
      message: 'Friend removed successfully',
    };
  },

  // subscribe to friend request
  newFriendRequestSubscription: {
    subscribe: () => {
      return pubsub.asyncIterator('NEW_FRIEND_REQUEST');
    },
  },
};
