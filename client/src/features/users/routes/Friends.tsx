import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from './api/queries';
import { FriendsList } from '../../../components/FriendsList';
import { Search } from '../../../components/Search';
import { REMOVE_FRIEND } from './api/mutations';

export const Friends = () => {
  const [removeFriend] = useMutation(REMOVE_FRIEND);
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

  const removeFromFriendList = async (friendId: string) => {
    try {
      const { errors } = await removeFriend({
        variables: { friendId },
        update(cache) {
          const { me } = (cache.readQuery({
            query: GET_ME,
          }) as { me: User }) || { me: null };
          if (me) {
            cache.writeQuery({
              query: GET_ME,
              data: {
                me: {
                  ...me,
                  friends: me.friends.filter(
                    (friend) => friend._id !== friendId
                  ),
                },
              },
            });
          }
        },
      });
      if (errors) throw new Error(errors[0].message);

      setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className='container mx-auto text-white'>
      <div className='flex justify-center'>
        <div className='flex flex-col justify-center w-full max-w-md px-2'>
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
                  onClick={removeFromFriendList}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
