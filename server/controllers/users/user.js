const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../../models');

module.exports = {
  // Query for current user
  me: async (parent, args, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    const userData = await User.findOne({ _id: context.user._id })
      .select('-__v -password')
      .populate({
        path: 'posts',
        populate: [
          {
            path: 'postAuthor',
            model: 'User',
          },
          {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'commentAuthor',
              model: 'User',
            },
          },
          {
            path: 'likes',
            model: 'User',
          },
        ],
      })
      .populate({
        path: 'friends',
        model: 'User',
        select: '-__v -password',
      })
      .populate({
        path: 'friendRequests',
        model: 'User',
        select: '-__v -password',
      });

    userData.posts.sort((a, b) => b.createdAt - a.createdAt);

    return userData;
  },
  // Query for all users not including current user and users already friends with
  users: async (parent, args, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    const user = await User.findOne({ _id: context.user._id }).select(
      '-__v -password'
    );

    if(!user) {
      throw new AuthenticationError('No user found!');
    }

    const userData = await User.find({
      $and: [
        { _id: { $ne: user._id } },
        { _id: { $nin: user.friends } },
        { _id: { $nin: user.friendRequests } },
      ],
    }).select('-__v -password');

    return userData;
  },

  // Query for a single user by id
  user: async (parent, { id }, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    return User.findOne({ _id: id })
      .select('-__v -password')
      .populate('posts')
      .populate('friends')
      .populate('friendRequests')
      .populate({
        path: 'posts',
        populate: {
          path: 'postAuthor',
          select: '-__v -password',
        },
      })
      .populate({
        path: 'posts',
        populate: {
          path: 'comments',
          model: 'Comment',
          populate: {
            path: 'commentAuthor',
            model: 'User',
            select: '-__v -password',
          },
        },
      })
      .populate({
        path: 'posts',
        populate: {
          path: 'likes',
          model: 'User',
          select: '-__v -password',
        },
      });
  },
};
