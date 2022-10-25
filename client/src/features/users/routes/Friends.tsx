import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from './api/queries';
import { FriendsList } from '../../../components/FriendsList';
import { Search } from '../../../components/Search';

export const Friends = () => {
  const [friends, setFriends] = useState<Friends[]>([]);
  const { data, loading, error } = useQuery(GET_ME, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (!data) return;
    setFriends(data.me.friends);
  }, [data, loading, error]);

  const handleSearch = (searchTerm: string) => {
    const filteredFriends = data.me.friends.filter((friend: Friends) => {
      return friend.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFriends(filteredFriends);
  };

  return (
    <div className='container mx-auto p-3 text-white'>
      <div className='flex justify-center'>
        <div className='flex flex-col justify-center w-full max-w-md'>
          <Search handleSearch={handleSearch} />
          <div className='bg-slate-800 rounded-lg shadow-xl p-2 sm:p-3 border border-slate-700'>
            {!friends?.length && (
              <p className='text-center text-slate-300'>No friends</p>
            )}
            {friends?.map((friend: Friends, index: number) => {
              const isLastEl = index === friends.length - 1;
              return (
                <FriendsList
                  key={index}
                  {...friend}
                  isLastEl={isLastEl}
                  onClick={() => console.log('remove friend')}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
