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
  // Query for all users
  users: async (parent, args, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    return User.find()
      .select('-__v -password')
      .populate('posts')
      .populate('friends')
      .populate('friendRequests')
      .populate('blockedUsers');
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
