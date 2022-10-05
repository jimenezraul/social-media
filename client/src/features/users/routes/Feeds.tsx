import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ME, FEED } from "./api/queries";
import { Post } from "../../../components/Posts";
import { FriendsList } from "../../../components/FriendsList";
import { MeCard } from "../../../components/MeCard";

export const Feed = () => {
  const [friends, setFriends] = useState<Friends[]>([]);
  const [me, setMe] = useState<User>();
  const { data, loading, error } = useQuery(GET_ME);
  const {
    data: feedData,
    loading: feedLoading,
    error: feedError,
  } = useQuery(FEED, { fetchPolicy: "no-cache" });

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (!data) return;
    setMe(data.me);
    setFriends(data.me.friends);
  }, [data, loading, error]);

  return (
    <div className="flex flex-1 text-white">
      <div className="container mx-auto xl:px-24 2xl:px-52">
        <div className="flex flex-wrap justify-center h-full max-h-full">
          <div className="hidden md:block w-full md:w-4/12 xl:w-3/12 px-3 mb-4">
            <MeCard {...Object(me)} />
          </div>
          <div className="flex flex-col flex-1 w-full md:w-5/12 xl:w-4/12 px-3 h-full overflow-y-scroll no-scrollbar">
            {feedData?.feed.map((post: Post, index: any) => {
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
                const isLastEl = index === friends.length - 1;
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
