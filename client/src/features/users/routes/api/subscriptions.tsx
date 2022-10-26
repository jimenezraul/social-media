import { gql } from "@apollo/client";
import { store } from "../../../../app/store";
import { setNotifications } from "../../../../features/users/userSlice";

export const NEW_FRIEND_REQUEST = gql`
  subscription New_Friend_Request {
    newFriendRequestSubscription {
      user {
        _id
        profileUrl
        given_name
        family_name
        fullName
      }
      friendId
      requestExists
    }
  }
`;

export const subscribeToFriendRequests = (subscribeToMore: any) => {
  subscribeToMore({
    document: NEW_FRIEND_REQUEST,
    updateQuery: (prev: any, { subscriptionData }: any) => {
     
      if (!subscriptionData.data) return prev;
      const newFriendRequest =
        subscriptionData.data.newFriendRequestSubscription;
      const user = store.getState().user;
   
      const data = {
        type: "friendRequest",
        postId: newFriendRequest.friendId,
        message: `${newFriendRequest.user.fullName} sent you a friend request`,
        user: newFriendRequest.user,
        post: {
          _id: newFriendRequest.friendId,
        },
      };
      
      if (
        newFriendRequest.friendId === user.user._id &&
        newFriendRequest.requestExists
      ) {
        store.dispatch(setNotifications([...user.notifications, data]));
        localStorage.setItem(
          "notifications",
          JSON.stringify([...user.notifications, data])
        );
      } else {
        const filteredNotifications = user.notifications.filter(
          (notification: any) =>
            notification.post._id !== newFriendRequest.friendId
        );
        store.dispatch(setNotifications(filteredNotifications));
        localStorage.setItem(
          "notifications",
          JSON.stringify(filteredNotifications)
        );
      }

      return prev;
    },
  });
};
