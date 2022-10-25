import { Link } from "react-router-dom";

type logout = {
  logoutUser: () => void;
  setIsOpen: (value: boolean) => void;
  setCurrentPath: (value: string) => void;
};

const profileHandler = (
  setCurrentPath: (value: string) => void,
  setIsOpen: (value: boolean) => void
) => {
  setIsOpen(false);
  setCurrentPath("/profile");
};

export const Dropdown = ({ logoutUser, setIsOpen, setCurrentPath }: logout) => {
  return (
    <div className="z-20 absolute top-12 bg-slate-800 p-2 w-32 right-1 rounded-lg border border-slate-600">
      <Link
        to="/profile"
        onClick={() => profileHandler(setCurrentPath, setIsOpen)}
      >
        <button className="text-start px-4 py-2 rounded-lg w-full text-white hover:bg-slate-600">
          Profile
        </button>
      </Link>
      <Link
        to="/friends"
        onClick={() => profileHandler(setCurrentPath, setIsOpen)}
      >
        <button className="text-start px-4 py-2 rounded-lg w-full text-white hover:bg-slate-600">
          Friends
        </button>
      </Link>

      <button
        onClick={() => logoutUser()}
        className="text-start px-4 py-2 rounded-lg w-full text-white hover:bg-slate-600"
      >
        Logout
      </button>
    </div>
  );
};
