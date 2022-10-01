import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      _id
      given_name
      family_name
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
        }
        createdAt
        createdAtFormatted
        comments {
          commentText
          commentAuthor {
            fullName
            profileUrl
          }
          createdAt
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
