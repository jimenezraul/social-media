const {
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');
const { User, Post, Comment } = require('../../models');
const { PubSub } = require('graphql-subscriptions');
const { withFilter } = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
  // get all posts
  posts: async (parent, args, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    if (!context.user.isAdmin) {
      throw new ForbiddenError('You are not authorized to perform this action');
    }

    return Post.find()
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
      .populate('likes');
  },

  // get a single post by id
  post: async (parent, { postId }, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new AuthenticationError('You need to be logged in!');
    }

    return Post.findOne({ _id: postId })
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
      .populate('likes');
  },

  // add a post
  addPost: async (parent, args, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    const user = context.user;

    const post = await Post.create({
      ...args,
      postAuthor: user._id,
    });

    const newPost = await Post.findOne({ _id: post._id }).populate({
      path: 'postAuthor',
      select: '-__v -password',
    });

    await User.findByIdAndUpdate(
      { _id: context.user._id },
      { $push: { posts: post._id } },
      { new: true }
    );

    pubsub.publish('NEW_POST', {
      newPostSubscription: newPost,
    });

    return post.populate({
      path: 'postAuthor',
      select: '-__v -password',
    });
  },

  // update a post
  updatePost: async (parent, { postId, postText }, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    const post = await Post.findOne({ _id: postId });

    if (post.postAuthor.toString() !== context.user._id) {
      throw new ForbiddenError('You are not authorized to update this post!');
    }

    return (updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { postText },
      { new: true, runValidators: true }
    )
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
      .populate('likes'));
  },

  // delete a post
  deletePost: async (parent, { postId }, context) => {
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    // check if the post exists
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      throw new AuthenticationError('Post does not exist!');
    }

    // check if the logged in user is the post author or is an admin
    if (
      post.postAuthor._id.toString() !== context.user._id.toString() &&
      !context.user.isAdmin
    ) {
      throw new ForbiddenError('You are not authorized to delete this post!');
    }

    // delete all the comments associated with the post
    await Comment.deleteMany({ _id: { $in: post.comments } });

    // delete the post
    await Post.findOneAndDelete({ _id: postId });

    // remove the post from the user's posts array
    await User.findByIdAndUpdate(
      { _id: context.user._id },
      { $pull: { posts: postId } },
      { new: true }
    );

    return {
      success: true,
      message: 'Post deleted!',
    };
  },

  newPostSubscription: {
    // return pubsub.asyncIterator('NEW_POST'); to post author friends
    subscribe: withFilter(
      () => pubsub.asyncIterator('NEW_POST'),
      (payload, variables) => {
        // return to post author and post author friends
        return (
          payload.newPostSubscription.postAuthor._id.toString() ===
            variables.userId.toString() ||
          payload.newPostSubscription.postAuthor.friends.includes(
            variables.userId
          )
        );
      }
    ),
  },
};
