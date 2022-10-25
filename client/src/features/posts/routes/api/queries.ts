import {gql} from '@apollo/client'

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
