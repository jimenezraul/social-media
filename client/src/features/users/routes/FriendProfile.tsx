import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_FRIEND, GET_ME } from './api/queries';
import { MeCard } from '../../../components/MeCard';

export const FriendProfile = () => {
  const [me, setMe] = useState<User | null>(null);
  const [friend, setFriend] = useState<User | undefined>(undefined);
  const { id } = useParams<{ id: string }>()!;
  const [
    Me,
    { data: meData, loading: meLoading, error: meError },
  ] = useLazyQuery(GET_ME, {
    fetchPolicy: 'no-cache',
  });

  const { data, loading, error } = useQuery(GET_FRIEND, {
    variables: { friendId: id },
  });

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (!data) return;

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

  return (
    <div className='container mx-auto'>
      <div className='flex flex-wrap justify-center'>
        <div className='w-full max-w-md'>
          <MeCard me={friend} inFriendRequest={!!isFriendRequest} />
        </div>
      </div>
    </div>
  );
};
