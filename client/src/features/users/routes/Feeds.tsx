import { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { FEED, GET_ME } from "./api/queries";
import { Post } from "../../../components/Posts";
import { FriendsList } from "../../../components/FriendsList";
import { MeCard } from "../../../components/MeCard";
import { AddPost } from "../../../components/AddPost";
import {
  subscribeToNewPost,
  subscribeToNewComment,
  subscribeToNewLike,
} from "../../../utils/subscriptions";

export const Feed = () => {
  const [Me, { data: meData, loading: meLoading, error: meError }] =
    useLazyQuery(GET_ME, {
      fetchPolicy: "no-cache",
    });
  const [feed, setFeed] = useState<Post[]>([]);
  const [friends, setFriends] = useState<Friends[]>([]);

  const {
    data: feedData,
    loading: feedLoading,
    error: feedError,
    subscribeToMore,
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
    }

    if (meLoading) return;
    if (meError) return;
    if (!meData) return;
    
    setFriends(meData.me.friends);
  }, [feedData, feedLoading, feedError, Me, meData, meLoading, meError, feed]);

  useEffect(() => {
    if (subscribeToMore) {
      subscribeToNewPost(subscribeToMore);
      subscribeToNewComment(subscribeToMore);
      subscribeToNewLike(subscribeToMore);
    }
  }, [subscribeToMore]);

  const me = meData ? meData.me : {};

  return (
    <div className="flex flex-1 text-white">
      <div className="container mx-auto xl:px-24 2xl:px-52">
        <div className="flex flex-wrap justify-center h-full max-h-full">
          <div className="hidden md:block w-full md:w-4/12 xl:w-3/12 px-3 mb-4">
            <MeCard {...Object(me)} />
          </div>
          <div className="flex flex-col flex-1 w-full md:w-5/12 xl:w-4/12 px-3 h-full overflow-y-scroll no-scrollbar">
            <AddPost me={me} />
            {feed?.map((post: Post, index: any) => {
              const isLastEl = index === feedData?.feed.length - 1;
              return <Post key={index} {...post} isLastEl={isLastEl} />;
            })}
          </div>
          <div className="hidden lg:block md:w-3/12 xl:w-4/12 px-3">
            <div className="bg-slate-800 rounded-lg shadow-xl p-5 border border-slate-700">
              {!friends?.length && (
                <p className="text-center text-slate-300">
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
                    onClick={() => console.log("remove friend")}
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
