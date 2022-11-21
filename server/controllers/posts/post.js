const { GraphQLError } = require('graphql');
const { User, Post, Comment } = require('../../models');
const { PubSub, withFilter } = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
  // get all posts
  posts: async (parent, args, context) => {
    if (!context.user) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    if (!context.user.isAdmin) {
      throw new GraphQLError('You are not authorized to perform this action', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const post = await Post.findOne({ _id: postId });

    if (post.postAuthor.toString() !== context.user._id) {
      throw new GraphQLError('You are not authorized to update this post!', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    // check if the post exists
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      throw new GraphQLError('Post does not exist!', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    // check if the logged in user is the post author or is an admin
    if (
      post.postAuthor._id.toString() !== context.user._id.toString() &&
      !context.user.isAdmin
    ) {
      throw new GraphQLError('You are not authorized to delete this post!', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
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
