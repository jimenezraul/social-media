const { GraphQLError } = require('graphql');
const { User, Notification } = require('../../models');
const { PubSub, withFilter } = require('graphql-subscriptions');
const mongoose = require('mongoose');

const pubsub = new PubSub();

module.exports = {
  // friend request
  friendRequest: async (parent, args, context) => {
    const { friendId } = args;

    if (!context.user) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const user = await User.findOne({ _id: friendId }).select('-__v -password');
    const friend = await User.findOne({ _id: context.user._id }).select(
      '-__v -password'
    );

    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    if (user.friendRequests.includes(context.user._id)) {
      user.friendRequests.pull(context.user._id);
      user.friendRequestCount -= 1;

      const notification = await Notification.find({
        sender: context.user._id,
        recipient: friendId,
        type: 'FRIEND_REQUEST',
      });

      await Notification.findByIdAndDelete(notification[0]._id);

      user.notifications.pull(notification[0]._id);
      user.save();

      pubsub.publish('NEW_FRIEND_REQUEST', {
        newFriendRequestSubscription: {
          _id: notification._id,
          message: 'Removed friend request',
        },
      });

      return {
        success: true,
        message: 'Friend request removed',
      };
    }

    user.friendRequests.push(context.user._id);
    user.friendRequestCount = user.friendRequestCount + 1;
    const notification = await Notification.create({
      sender: context.user._id,
      recipient: friendId,
      type: 'FRIEND_REQUEST',
      message: `${friend.given_name} ${friend.family_name} sent you a friend request`,
    });

    user.notifications.push(notification);
    user.save();
    const newNotification = await Notification.findOne({
      _id: notification._id.toString(),
    })
      .populate('sender', '-__v -password')
      .populate('recipient', '-__v -password');

    pubsub.publish('NEW_FRIEND_REQUEST', {
      newFriendRequestSubscription: newNotification,
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const user = await User.findOne({ _id: context.user._id });

    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    if (!user.friendRequests.includes(friendId)) {
      throw new GraphQLError('You have not received a friend request', {
        extensions: {
          code: 'FRIEND_REQUEST_NOT_FOUND',
        },
      });
    }

    if (user.friends.includes(friendId)) {
      throw new GraphQLError('You are already friends', {
        extensions: {
          code: 'ALREADY_FRIENDS',
        },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const user = await User.findOne({ _id: context.user._id });

    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    if (!user.friends.includes(friendId)) {
      throw new GraphQLError('You are not friends', {
        extensions: {
          code: 'NOT_FRIENDS',
        },
      });
    }

    user.friends.pull(friendId);
    user.save();

    // remove friend from friend's friends list
    await User.findOneAndUpdate(
      { _id: friendId },
      { $pull: { friends: context.user._id } },
      { new: true }
    );

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
