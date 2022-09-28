import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/users/userSlice";

export const Profile = () => {
  const user = useAppSelector(selectUser);
  const { given_name, picture } = Object(user?.user);
  return (
    <div className="">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/2">
            <h1 className="text-5xl">Profile</h1>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl">{given_name}</h2>
            <img src={picture} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
