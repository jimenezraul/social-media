import { Button } from "../CustomButton";

interface isLastEl extends User {
  isLastEl: boolean;
  buttonName: string;
  onClick: () => void;
}

export const FriendsList = ({
    _id,
  profileUrl,
  fullName,
  isLastEl,
  buttonName,
  onClick,
}: isLastEl) => {
  return (
    <div className="flex flex-wrap justify-center items-center">
      <div className="w-1/2 md:w-full flex xl:w-1/2 xl:mr-3 mb-3 xl:mb-0">
        <img
          className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-slate-500 bg-gradient-to-r from-blue-600 to to-red-500"
          src={`${profileUrl}`}
          alt=""
        />
        <h1 className="text-xl font-semibold mt-2">{fullName}</h1>
      </div>
      <Button
        onClick={onClick}
        name={buttonName}
        className="bg-gradient-to-r from-blue-600 to to-red-500 hover:from-blue-700 hover:to-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      />
      {!isLastEl && <div className="w-full mt-6 mb-6 h-px bg-slate-500"></div>}
    </div>
  );
};
