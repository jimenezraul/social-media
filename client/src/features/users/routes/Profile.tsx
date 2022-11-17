import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../../../utils/queries';
import { Post } from '../../../components/Posts';
import { FriendsList } from '../../../components/FriendsList';
import { MeCard } from '../../../components/MeCard';
import { REMOVE_FRIEND } from '../../../utils/mutations';
import {
  subscribeToNewPost,
  subscribeToNewLike,
  subscribeToNewComment,
} from '../../../utils/subscribe';

export const Profile = () => {
  const [removeFriend] = useMutation(REMOVE_FRIEND);
  const [friends, setFriends] = useState<Friends[]>([]);
  const { data, loading, error, subscribeToMore } = useQuery(GET_ME);

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (!data) return;

    setFriends(data.me.friends);
  }, [data, loading, error]);

  useEffect(() => {
    if (subscribeToMore) {
      subscribeToNewLike(subscribeToMore);
      subscribeToNewComment(subscribeToMore);
      subscribeToNewPost(subscribeToMore);
    }
  }, [subscribeToMore]);

  const me = data?.me;

  if (me === undefined) return <div>Loading...</div>;

  const removeFromFriendList = async (friendId: string) => {
    try {
      const { errors } = await removeFriend({
        variables: { friendId },
        update: (cache) => {
          cache.modify({
            fields: {
              me: (existingMe = {}) => {
                const newFriends = existingMe.friends.filter(
                  (friend: Friends) => friend._id !== friendId,
                );
                return { ...existingMe, friends: newFriends };
              },
            },
          });
        },
      });
      if (errors) throw new Error(errors[0].message);

      setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex w-full text-white">
      <div className="lg:container mx-auto w-full">
        <div className="flex flex-wrap justify-center h-full max-h-full overflow-y-scroll sm:overflow-y-hidden no-scrollbar">
          <div className="w-full sm:max-w-xs px-2 mb-4">
            <MeCard me={me} isProfile />
          </div>
          <div className="flex flex-col flex-1 w-full sm:max-w-sm md:max-w-2xl px-2 sm:overflow-y-scroll no-scrollbar">
            {me?.posts.length ? (
              me?.posts.map((post: Post, index: number) => {
                const isLastEl = index === me?.posts.length - 1;
                return <Post key={index} {...post} isLastEl={isLastEl} isProfile />;
              })
            ) : (
              <div className="h-20 border border-slate-700 mb-4 break-inside rounded-lg bg-slate-800 flex flex-col justify-center bg-clip-border">
                <p className="text-lg font-semibold text-center text-slate-300">
                  You have no posts yet!
                </p>
              </div>
            )}
          </div>
          <div className="hidden xl:block md:w-3/12 xl:w-4/12 px-3">
            <div className="bg-slate-800 rounded-lg shadow-xl p-5 border border-slate-700">
              {!friends?.length && (
                <p className="text-center text-slate-300">You have no friends yet!</p>
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
    </div>
  );
};
