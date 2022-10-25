import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_FRIEND, GET_ME } from '../../../utils/queries';
import { MeCard } from '../../../components/MeCard';
import { Post } from '../../../components/Posts';

export const FriendProfile = () => {
  const [me, setMe] = useState<User | undefined>(undefined);
  const [friend, setFriend] = useState<User | undefined>(undefined);
  const { id } = useParams<{ id: string }>()!;
  const [Me, { data: meData, loading: meLoading, error: meError }] =
    useLazyQuery(GET_ME, {
      fetchPolicy: 'no-cache',
    });

  const { data, loading, error } = useQuery(GET_FRIEND, {
    variables: { friendId: id },
  });

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (!data) return;

    if (!data.user) {
      setFriend(undefined);
      return;
    }

    setFriend(data.user);

    // call me query after friend query
    if (!meData && !meLoading && !meError) {
      Me();
    }

    if (meLoading) return;
    if (meError) return;
    if (!meData) return;

    setMe(meData.me);
  }, [data, loading, error, Me, meData, meLoading, meError]);

  const isFriendRequest = me?.friendRequests.find(
    (friend) => friend._id === id
  );
  console.log(friend);
  return (
    <div className='lg:container mx-auto w-full'>
      <div className='flex flex-wrap justify-center h-full max-h-full overflow-y-scroll sm:overflow-y-hidden'>
        <div className='w-full sm:max-w-xs  px-2 mb-4'>
          <MeCard me={friend} inFriendRequest={!!isFriendRequest} />
        </div>
        <div className='flex flex-col flex-1 w-full sm:max-w-sm md:max-w-lg px-2 h-full sm:overflow-y-scroll no-scrollbar mb-32 sm:mb-0 text-white'>
          {!isFriendRequest &&
            (friend?.posts.length! > 0 ? (
              friend?.posts.map((post) => <Post key={post._id} {...post} />)
            ) : (
              <div className='text-center'>
                <h1 className='text-2xl font-bold'>No Posts</h1>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
