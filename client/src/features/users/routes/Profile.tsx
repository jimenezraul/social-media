import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ME } from "./api/queries";
import { Post } from "../../../components/Posts";
import { FriendsList } from "../../../components/FriendsList";

export const Profile = () => {
  const [me, setMe] = useState<User >();
  const { data, loading, error } = useQuery(GET_ME);
console.log(me)
  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (!data) return;
    setMe(data.me);
  }, [data, loading, error]);

  const { postCount, friends } = Object(me);

  const postsName = postCount === 1 ? "post" : "posts";
  const friendsName = friends?.length === 1 ? "friend" : "friends";

  return (
    <div className="flex-1 flex text-white">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center h-full">
          <div className="w-full md:w-4/12 xl:w-3/12">
            <h1 className="font-semibold text-4xl tracking-tight text-center pb-5 mb-2">
              Profile
            </h1>
          </div>
          <div className="flex flex-col w-full md:w-5/12 xl:w-4/12 overflow-y-auto px-3">
            <h2 className="text-sm font-semibold text-end mb-2 px-2">
              {postCount} {postsName}
            </h2>
            {me?.posts.map((post: Post, index) => (
              <Post key={index} {...post} />
            ))}
          </div>
          <div className="w-full md:w-3/12 xl:w-4/12 px-3">
            <h2 className="text-sm font-semibold text-end mb-2 px-2">
              {friends?.length} {friendsName}
            </h2>
            <div className="bg-slate-800 rounded-lg shadow-xl p-5 border border-slate-700">
              {!friends?.length && (
                <p className="text-center text-slate-300">
                  You have no friends yet!
                </p>
              )}
              {friends?.map((friend: User, index: number) => {
                const isLastEl = index === friends.length - 1;
                return (
                  <FriendsList
                    key={index}
                    {...friend}
                    isLastEl={isLastEl}
                    buttonName="Remove Friend"
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
