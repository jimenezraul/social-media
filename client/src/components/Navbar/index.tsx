import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [currentPath, setCurrentPath] = useState<String>(
    window.location.pathname
  );

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

  return (
    <nav className="flex items-center justify-between flex-wrap p-6">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">
            Social Media
          </span>
        </div>
        <div className="block lg:hidden">
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
          <div>
            <Link to="#" className="text-white font-bold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
