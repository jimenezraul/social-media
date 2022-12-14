import { useMutation } from '@apollo/client';
import { ACCEPT_FRIEND_REQUEST } from '../../utils/mutations';
import { useNavigate } from 'react-router-dom';

interface ME {
  me: User | undefined;
  inFriendRequest?: boolean;
  isProfile?: boolean;
}

export const MeCard = ({ me, inFriendRequest, isProfile }: ME) => {
  const [acceptFriend] = useMutation(ACCEPT_FRIEND_REQUEST);
  const navigate = useNavigate();

  if (me === undefined)
    return (
      <div className='overflow-hidden bg-slate-800 border border-slate-600 rounded-lg w-full hover:shadow-none relative flex flex-col mx-auto shadow-lg'>
        <div className='absolute bg-slate-900 h-28 w-full'></div>
        <div className='flex flex-col items-center mt-16 text-white z-10'>
          <div className='rounded-full bg-slate-700 h-28 w-28'></div>
          <div className='h-2 mt-3 w-40 bg-slate-700 rounded col-span-2'></div>
        </div>

        <div className='flex-1 space-y-6 py-6'>
          <div className='space-y-3 flex justify-center'>
            <div className='grid grid-cols-2 gap-4 w-52'>
              <div className='h-2 bg-slate-700 rounded col-span-1'></div>
              <div className='h-2 bg-slate-700 rounded col-span-1'></div>
            </div>
            <div className='h-2 bg-slate-700 rounded'></div>
          </div>
        </div>
      </div>
    );

  const { profileUrl, given_name, family_name, posts, friends } = me;
  const postCount = posts?.length;
  const postOrPosts = posts?.length <= 1 ? 'post' : 'posts';
  const friendCount = friends?.length;
  const friendOrFriends = friendCount <= 1 ? 'friend' : 'friends';

  // replace =s96-c with =s400-c to get a larger image
  const profileUrl400 = profileUrl?.replace('=s96-c', '=s400-c');

  const acceptFriendRequest = async () => {
    try {
      const res = await acceptFriend({
        variables: {
          friendId: me._id,
        },
      });

      if (!res.data.acceptFriendRequest.success) {
        throw new Error('Something went wrong');
      }

      navigate('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  const declineFriendRequest = () => {
    console.log('decline friend request');
  };

  return (
    <div className='overflow-hidden bg-slate-800 border border-slate-600 rounded-lg w-full hover:shadow-none relative flex flex-col mx-auto shadow-lg'>
      <img
        className='max-h-28 w-full opacity-80 absolute top-0 -z-0'
        src='/assets/img/banner-bg.jpg'
        alt=''
      />
      {isProfile && (
        <i className='absolute cursor-pointer top-4 right-4 border border-slate-500 bg-slate-600 hover:bg-slate-700 p-3 rounded-full fa-solid fa-pen-to-square'></i>
      )}
      <div className='flex flex-col items-center mt-16 text-white z-10'>
        <div className='relative'>
          <img
            className='w-28 h-28 p-1 bg-default rounded-full'
            src={`${profileUrl400}`}
            alt=''
            referrerPolicy='no-referrer'
          ></img>
          {isProfile && (
            <i className='absolute bottom-0 right-0 border border-slate-500 bg-slate-600 cursor-pointer hover:bg-slate-700 p-3 rounded-full fa-solid fa-camera'></i>
          )}
        </div>
        <div className='mt-3 font-bold flex flex-col'>
          {given_name} {family_name}
        </div>
      </div>
      {friendCount !== undefined && (
        <div className='flex justify-center font-bold  text-xs text-slate-300 my-4'>
          <div className='bg-slate-700 border border-r-0 rounded-l-2xl border-gray-500 p-1 px-4'>
            {postCount} {postOrPosts}
          </div>
          <div className='bg-slate-700 border rounded-r-2xl border-gray-500 p-1 px-4'>
            {friendCount} {friendOrFriends}
          </div>
        </div>
      )}
      {/* if is friendRequest but not inFriendRequest */}
      {inFriendRequest && (
        <div className='flex justify-center mb-3'>
          <div className='border border-slate-600 rounded'>
            <button
              onClick={acceptFriendRequest}
              className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-l'
            >
              Accept
            </button>
            <button
              onClick={declineFriendRequest}
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-r'
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
