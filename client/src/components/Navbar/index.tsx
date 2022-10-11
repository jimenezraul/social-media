import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUser, user_logout } from "../../features/users/userSlice";
import { useAppDispatch } from "../../app/hooks";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../../utils/mutations";
import { Dropdown } from "../Dropdown";
import { useOutside } from "../../utils/useOutside";

const Navbar = () => {
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [currentPath, setCurrentPath] = useState<String>(
    window.location.pathname
  );

  const [logout] = useMutation(LOGOUT);

  const routes = [
    {
      name: "feed",
      path: "/feed",
    },
    {
      name: "profile",
      path: "/profile",
    },
  ];

  useOutside(menuRef, setIsOpen);

  const logoutUser = async () => {
    dispatch(user_logout());
    await logout();
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  const user = useAppSelector(selectUser).user;
  const { profileUrl } = Object(user);

  return (
    <nav className="relative flex items-center justify-between flex-wrap p-6">
      <div className="container mx-auto flex flex-wrap  justify-between">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">
            Social Media
          </span>
        </div>

        <div
          className={`w-full hidden flex-grow lg:flex lg:items-center lg:w-auto`}
        >
          <div className="text-sm lg:flex-grow">
            {routes.map((route, index) => {
              // check if the route is active
              const isActive = currentPath === route.path;

              return (
                <Link
                  key={index}
                  to={route.path}
                  onClick={() => setCurrentPath(route.path)}
                  className={`${
                    isActive && "text-gray-50"
                  } uppercase block mt-4 lg:inline-block lg:mt-0 text-slate-400 hover:text-white mr-4`}
                >
                  {route.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <Link to="/messages">
            <i className="text-xl fa-solid fa-comment text-slate-300"></i>
          </Link>
          <Link to="/notifications">
            <i className="text-xl fa-solid fa-bell text-slate-300"></i>
          </Link>
          <div className="flex relative" ref={menuRef}>
            <img
              className="mr-2 h-10 bg-gradient-to-r from-blue-600 to to-red-500 rounded-full p-0.5"
              src={`${profileUrl}`}
              alt=""
              referrerPolicy="no-referrer"
              onClick={() => setIsOpen(!isOpen)}
            />
            {/* <button type="button" onClick={logoutUser} className="text-white">
            Logout
          </button> */}
            {isOpen && <Dropdown logoutUser={logoutUser} />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
