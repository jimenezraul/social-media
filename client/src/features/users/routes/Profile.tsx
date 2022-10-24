import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ME } from "./api/queries";
import { Post } from "../../../components/Posts";
import { FriendsList } from "../../../components/FriendsList";
import { MeCard } from "../../../components/MeCard";

export const Profile = () => {
  const [friends, setFriends] = useState<Friends[]>([]);
  const [me, setMe] = useState<User>();
  const { data, loading, error } = useQuery(GET_ME);

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (!data) return;
    setMe(data.me);
    setFriends(data.me.friends);
  }, [data, loading, error]);

  if (me === undefined) return <div>Loading...</div>;
  console.log(me);
  return (
    <div className="flex flex-1 text-white">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center h-full max-h-full">
          <div className="hidden md:block w-full md:w-4/12 xl:w-3/12 px-3 mb-4">
            <MeCard me={me} />
          </div>
          <div className="flex flex-col flex-1 w-full md:w-5/12 xl:w-4/12 px-3 h-full overflow-y-scroll no-scrollbar">
            {me?.posts.length ? (
              me?.posts.map((post: Post, index) => {
                const isLastEl = index === me?.posts.length - 1;
                return (
                  <Post key={index} {...post} isLastEl={isLastEl} isProfile />
                );
              })
            ) : (
              <div className="h-20 border border-slate-700 mb-4 break-inside rounded-lg bg-slate-800 flex flex-col justify-center bg-clip-border">
                <p className="text-lg font-semibold text-center text-slate-300">
                  You have no posts yet!
                </p>
              </div>
            )}
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
