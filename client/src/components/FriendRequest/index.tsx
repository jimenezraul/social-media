import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_FRIEND_REQUEST } from '../../utils/mutations';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/userSlice';
import { Link } from 'react-router-dom';

export const FriendRequest = ({ _id, fullName, profileUrl, friendRequests, email }: User) => {
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST);
  const user = useAppSelector(selectUser).user;
  // if user id is in friendRequests array, disable button
  useEffect(() => {
    const isFriendRequestSent = friendRequests.some(
      (friendRequest: any) => friendRequest._id === user._id,
    );
    if (isFriendRequestSent) {
      setIsRequestSent(true);
    }
  }, [friendRequests, user._id]);

  const handleFriendRequest = async () => {
    const friendId = _id;
    try {
      await sendFriendRequest({
        variables: {
          friendId,
        },
      });
      setIsRequestSent(!isRequestSent);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="border border-slate-700 flex justify-between items-center w-full bg-slate-800 rounded-lg shadow-lg p-4 mb-24">
      <Link to={`/profile/${_id}`}>
        <div className="flex justify-start items-center w-full">
          <img
            className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-slate-500 bg-gradient-to-r from-blue-600 to to-red-500"
            src={`${profileUrl}`}
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <h1 className="text-md font-semibold flex justify-center items-center text-slate-100">
              {fullName}
            </h1>
            
          </div>
        </div>
      </Link>
      <div className="flex flex-row justify-end items-center w-5/12">
        <button
          onClick={handleFriendRequest}
          className={`text-sm ${
            isRequestSent
              ? 'bg-red-800 hover:bg-red-900 text-slate-200'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        >
          {isRequestSent ? 'REMOVE REQUEST' : 'SEND REQUEST'}
        </button>
      </div>
    </div>
  );
};
