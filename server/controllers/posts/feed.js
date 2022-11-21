const { GraphQLError } = require('graphql');
const { User, Post } = require('../../models');

module.exports = {
  // feed for logged in user
  feed: async (parent, args, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const user = await User.findOne({ _id: context.user._id }).select(
      '-__v -password -refreshToken'
    );
    // get all my posts and posts from my friends
    const posts = await Post.find({
      $or: [{ postAuthor: user._id }, { postAuthor: { $in: user.friends } }],
    })
      .select('-__v')
      .populate({
        path: 'postAuthor',
        select: '-__v -password',
      })
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'commentAuthor',
            model: 'User',
          },
          {
            path: 'likes',
            model: 'User',
          },
        ],
      })
      .populate('likes')
      .sort({ createdAt: -1 });

    return posts;
  },
};
