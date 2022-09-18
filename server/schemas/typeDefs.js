const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Comment {
    _id: ID
    commentText: String
    commentAuthor: String
    createdAt: String
  }

  type Post {
    _id: ID
    postText: String
    postAuthor: User
    createdAt: String
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
    friendRequestsCount: Int
  }

  type Message {
    message: String
    subMessage: String
  }

  type Auth {
    message: String
    access_token: String
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(id: ID!): User
    posts: [Post]
    post(postId: ID!): Post
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
    logout: Message
    refreshToken: Auth
    addPost(postText: String!): Post
    addComment(postId: ID!, commentText: String!): Post
    friendRequest(friendId: ID!): Message
    acceptFriendRequest(friendId: ID!): Message
    removeComment(postId: ID!, commentId: ID!): Post
    likes(postId: ID!): Message
  }
`;

module.exports = typeDefs;
