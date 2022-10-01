import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectUser } from "../../../features/users/userSlice";
import { useQuery } from "@apollo/client";
import { GET_ME } from "./api/queries";

export const Profile = () => {
  const [me, setMe] = useState<{}>({});
  const { data, loading, error } = useQuery(GET_ME);

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (!data) return;
    setMe(data.me);
  }, [data, loading, error]);

  const { postCount, friends, friendRequestCount, given_name, profileUrl } =
    Object(me);
  console.log(Object(me));
  return (
    <div className="">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/2">
            <h1 className="text-5xl">Profile</h1>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl">{given_name}</h2>
            <img src={profileUrl} alt="" />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl">Friends</h2>
            {friends?.map((friend: Friends) => (
              <div key={friend._id}>
                <h3>{friend.fullName}</h3>
                <img src={friend.profileUrl} alt="" />
              </div>
            ))}
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl">Posts</h2>
            <h3>{postCount}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
