const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");

module.exports = {
  // feed for logged in user
  feed: async (parent, args, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new AuthenticationError("You need to be logged in!");
    }

    const user = await User.findOne({ _id: context.user._id }).select(
      "-__v -password -refreshToken"
    );

    const friends = user.friends;

    const friendPosts = await User.find({ _id: friends })
      .select("-__v -password")
      .populate("posts")
      .populate("friends")
      .populate("friendRequests")
      .populate({
        path: "posts",
        populate: {
          path: "postAuthor",
          select: "-__v -password",
        },
      })
      .populate({
        path: "posts",
        populate: {
          path: "comments",
          model: "Comment",
          populate: {
            path: "commentAuthor",
            model: "User",
          },
        },
      })
      .populate({
        path: "posts",
        populate: {
          path: "likes",
          model: "User",
        },
      });

    const friendPostsArray = friendPosts.map((friend) => friend.posts);

    const friendPostsFlat = friendPostsArray.flat();

    const sortedFriendPosts = friendPostsFlat.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return sortedFriendPosts;
  },
};
