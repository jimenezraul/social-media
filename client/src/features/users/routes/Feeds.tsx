import { useState, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { FEED, GET_ME } from '../../../utils/queries';
import { Post } from '../../../components/Posts';
import { FriendsList } from '../../../components/FriendsList';
import { MeCard } from '../../../components/MeCard';
import { AddPost } from '../../../components/AddPost';
import {
  subscribeToNewPost,
  subscribeToNewComment,
  subscribeToNewLike,
} from '../../../utils/subscribe';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { newPost, setNewPost } from '../../posts/postSlice';

export const Feed = () => {
  const dispatch = useAppDispatch();
  const newPostNotification = useAppSelector(newPost).newPost;

  const [Me, { data: meData, loading: meLoading, error: meError }] =
    useLazyQuery(GET_ME);
  const [feed, setFeed] = useState<Post[]>([]);
  const [friends, setFriends] = useState<Friends[]>([]);

  const {
    data: feedData,
    loading: feedLoading,
    error: feedError,
    subscribeToMore,
    refetch,
  } = useQuery(FEED);

  useEffect(() => {
    if (feedLoading) return;
    if (feedError) return;
    if (!feedData) return;

    if (feedData.feed.length > 0) {
      setFeed(feedData.feed);
    }

    if (!meData && !meLoading && !meError) {
      Me();
      refetch();
    }

    if (meLoading) return;
    if (meError) return;
    if (!meData) return;

    setFriends(meData.me.friends);
  }, [
    feedData,
    feedLoading,
    feedError,
    Me,
    meData,
    meLoading,
    meError,
    feed,
    refetch,
  ]);

  useEffect(() => {
    if (subscribeToMore) {
      subscribeToNewPost(subscribeToMore);
      subscribeToNewComment(subscribeToMore);
      subscribeToNewLike(subscribeToMore);
    }
  }, [subscribeToMore]);

  const refreshHandler = () => {
    refetch();
    dispatch(setNewPost(false));
  };

  const me = meData && meData.me;

  return (
    <div className='flex w-full text-white'>
      <div className='lg:container mx-auto w-full'>
        <div className='flex flex-wrap justify-center h-full max-h-full overflow-y-scroll sm:overflow-y-hidden no-scrollbar'>
          <div className='hidden sm:block w-full sm:max-w-xs px-2 mb-4'>
            <MeCard me={me} />
          </div>
          <div className='flex flex-col flex-1 w-full sm:max-w-sm md:max-w-2xl px-2 sm:overflow-y-scroll no-scrollbar mb-32 sm:mb-0'>
            <div className='relative flex flex-col h-full overflow-y-scroll no-scrollbar'>
              <div className='hidden md:flex flex-col flex-1'>
              <AddPost me={me} />
              </div>

              <div className='flex justify-center'>
                <div
                  className={`${
                    newPostNotification ? 'opacity-100' : 'opacity-0'
                  } absolute transition-all ease-in-out delay-150 duration-500 z-40 top-0 md:top-12 flex my-2 justify-center w-1/2`}
                >
                  <button
                    type='button'
                    onClick={refreshHandler}
                    className='rounded-full text-slate-800 bg-slate-300 px-2 py-1 text-sm'
                    // if newPost is true, desable button
                    disabled={!newPostNotification}
                  >
                    New Posts
                  </button>
                </div>
              </div>

              {feed?.map((post: Post, index: number) => {
                const isLastEl = index === feedData?.feed.length - 1;
                return <Post key={index} {...post} isLastEl={isLastEl} />;
              })}
            </div>
          </div>
          <div className='hidden xl:block md:w-3/12 xl:w-4/12 px-3'>
            <div className='bg-slate-800 rounded-lg shadow-xl p-5 border border-slate-700'>
              {!friends?.length && (
                <p className='text-center text-slate-300'>
                  You have no friends yet!
                </p>
              )}
              {friends?.map((friend: Friends, index: number) => {
                const isLastEl = index === me.friends.length - 1;
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
    </div>
  );
};
