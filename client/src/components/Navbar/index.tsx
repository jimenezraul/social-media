import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUser, user_logout } from "../../features/users/userSlice";
import { useAppDispatch } from "../../app/hooks";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../../utils/mutations";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [currentPath, setCurrentPath] = useState<String>(
    window.location.pathname
  );

  const [logout] = useMutation(LOGOUT);

  const routes = [
    {
      name: "profile",
      path: "/profile",
    },
    {
      name: "feed",
      path: "/feed",
    },
  ];

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
    <nav className="flex items-center justify-between flex-wrap p-6  bg-transparent">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">
            Social Media
          </span>
        </div>
        <div className="text-white block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded hover:text-white hover:border-white">
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
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
          <div className="flex">
            <img className="mr-2 h-10 bg-gradient-to-r from-blue-600 to to-red-500 rounded-full p-0.5" src={`${profileUrl}`} alt="" />
            <button type="button" onClick={logoutUser} className="text-white">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
