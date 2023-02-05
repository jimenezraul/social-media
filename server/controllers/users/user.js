const { GraphQLError } = require('graphql');
const { User } = require('../../models');
const csrf = require('../../utils/csrf');

module.exports = {
  // Query for current user
  me: async (parent, args, context) => {
    if (!context.user) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
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
      })
      .populate({
        path: 'messages',
        populate: [
          {
            path: 'members',
            model: 'User',
            select: '-__v -password',
          },
          {
            path: 'messages',
            populate: [
              {
                path: 'sender',
                model: 'User',
                select: '-__v -password',
              },
            ],
          },
        ],
      });

    userData.posts.sort((a, b) => b.createdAt - a.createdAt);
    if (!context.cookies['x-csrf-token']) {
      userData.csrfToken = csrf.createCsrfToken(context);
    } else {
      userData.csrfToken = context.cookies['x-csrf-token'];
    }
    return userData;
  },
  // Query for all users not including current user and users already friends with
  users: async (parent, args, context) => {
    if (!context.user) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const user = await User.findOne({ _id: context.user._id }).select(
      '-__v -password'
    );

    if (!user) {
      throw new GraphQLError('No user found!');
    }

    const userData = await User.find({
      $and: [
        { _id: { $ne: user._id } },
        { _id: { $nin: user.friends } },
        { _id: { $nin: user.friendRequests } },
      ],
    }).select('-__v -password');

    // filter out verified users
    const verifiedUsers = userData.filter((user) => user.isVerified);

    return verifiedUsers;
  },

  // Query for a single user by id
  user: async (parent, { id }, context) => {
    if (!context.user) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
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
