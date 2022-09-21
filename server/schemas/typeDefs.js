const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type Comment {
    _id: ID
    commentText: String
    commentAuthor: User
    createdAt: Date
  }

  type Post {
    _id: ID
    postText: String
    postAuthor: User
    createdAt: Date
    comments: [Comment]
    commentCount: Int
    likes: [User]
    likeCount: Int
  }

  type User {
    _id: ID
    given_name: String
    family_name: String
    email: String
    profileUrl: String
    isAdmin: Boolean
    isVerified: Boolean
    postCount: Int
    posts: [Post]
    friends: [User]
    friendRequests: [User]
    friendRequestCount: Int
    createdAt: Date
    updatedAt: Date
    provider: String
    fullName: String
    friendCount: Int
  }

  type Message {
    success: Boolean
    message: String
    subMessage: String
  }

  type Auth {
    success: Boolean
    message: String
    access_token: String
    user: User
    isLoggedIn: Boolean
  }

  type Query {
    me: User
    users: [User]
    user(id: ID!): User
    posts: [Post]
    post(postId: ID!): Post
    feed: [Post]
  }

  type Mutation {
    register(
      given_name: String!
      family_name: String!
      email: String!
      password: String!
    ): Message
    verifyUser(token: String!): Message
    login(email: String!, password: String!): Auth
    logout: Auth
    refreshToken: Auth
    addPost(postText: String!): Post
    addComment(postId: ID!, commentText: String!): Message
    updateComment(postId: ID!, commentId: ID!, commentText: String!): Message
    deleteComment(postId: ID!, commentId: ID!): Message
    updatePost(postId: ID!, postText: String!): Message
    deletePost(postId: ID!): Message
    friendRequest(friendId: ID!): Message
    acceptFriendRequest(friendId: ID!): Message
    likes(postId: ID!): Message
    googleLogin(idToken: String!): Auth
    removeFriend(friendId: ID!): Message
  }
`;

module.exports = typeDefs;
