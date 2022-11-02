import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Me {
    me {
      _id
      given_name
      family_name
      fullName
      email
      profileUrl
      isAdmin
      isVerified
      postCount
      posts {
        _id
        postText
        likeCount
        commentCount
        postAuthor {
          _id
          fullName
          given_name
          family_name
          profileUrl
        }
        createdAt
        createdAtFormatted
        comments {
          commentText
          commentAuthor {
            fullName
            profileUrl
          }
          createdAtFormatted
          likes {
            _id
            fullName
            email
          }
          replies {
            _id
            commentText
          }
          likesCount
        }
        likes {
          _id
          fullName
          profileUrl
        }
      }
      friendRequests {
        _id
      }
      friendRequestCount
      friends {
        _id
        given_name
        family_name
        fullName
        email
        isVerified
        profileUrl
      }
      blockedUsers {
        _id
        fullName
        profileUrl
      }
      createdAtFormatted
    }
  }
`;

export const FEED = gql`
  query Feed {
    feed {
      postText
      _id
      likeCount
      commentCount
      createdAtFormatted
      postAuthor {
        _id
        fullName
        given_name
        family_name
        profileUrl
        friends {
          _id
          fullName
        }
      }
      comments {
        _id
        commentText
        commentAuthor {
          _id
          fullName
          createdAtFormatted
        }
      }
      likes {
        _id
        fullName
        profileUrl
      }
    }
  }
`;

export const GET_ALL_USER = gql`
  query GetAllUser {
    users {
      _id
      given_name
      family_name
      profileUrl
      fullName
      isVerified
      email
      friendRequests {
        _id
      }
    }
  }
`;

export const GET_FRIEND = gql`
  query GetFriend($friendId: ID!) {
    user(id: $friendId) {
      _id
      given_name
      family_name
      fullName
      email
      profileUrl
      isAdmin
      isVerified
      postCount
      posts {
        _id
        postText
        likeCount
        commentCount
        postAuthor {
          _id
          fullName
          given_name
          family_name
          profileUrl
        }
        createdAt
        createdAtFormatted
        comments {
          commentText
          commentAuthor {
            fullName
            profileUrl
          }
          createdAtFormatted
          likes {
            _id
            fullName
            email
          }
          replies {
            _id
            commentText
          }
          likesCount
        }
        likes {
          _id
          fullName
          profileUrl
        }
      }
      friendRequests {
        _id
      }
      friendRequestCount
      friends {
        _id
        given_name
        family_name
        fullName
        email
        isVerified
        profileUrl
      }
      blockedUsers {
        _id
        fullName
        profileUrl
      }
      createdAtFormatted
    }
  }
`;

export const POST_BY_ID = gql`
  query GetPostById($postId: ID!) {
    post(postId: $postId) {
      _id
      postImage
      postText
      createdAtFormatted
      postAuthor {
        _id
        given_name
        family_name
        fullName
        profileUrl
      }
      comments {
        _id
        commentText
        createdAtFormatted
        commentAuthor {
          _id
          fullName
          profileUrl
        }
        replies {
          _id
          commentText
          commentAuthor {
            _id
            fullName
            profileUrl
          }
        }
        likes {
          _id
          fullName
          profileUrl
        }
        likesCount
      }
      commentCount
      likes {
        _id
        fullName
        profileUrl
      }
      likeCount
    }
  }
`;

export const GET_MESSAGES_BY_USER = gql`
  query Messages{
    chatByUser{
      _id
      members {
        family_name
        given_name
        _id
        profileUrl
      }
      messages {
        sender {
          _id
          given_name
          family_name
          profileUrl
        }
        text
        media
        createdAt
        status
      }
    }
  }
`;
