import { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { lazyImport } from "../utils/lazyImports";

import Navbar from "../components/Navbar";
import { Dock } from "../components/Dock";

const { Profile } = lazyImport(() => import("../features/users"), "Profile");
const { Friends } = lazyImport(() => import("../features/users"), "Friends");

const { Feed } = lazyImport(() => import("../features/users"), "Feed");

const Protected = () => {
  return (
    <div className="bg-slate-900 h-screen flex flex-col">
      <Navbar />
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center"></div>
        }
      >
        <div className="flex max-h-full overflow-hidden">
          <Outlet />
        </div>
      </Suspense>
      <Dock />
    </div>
  );
};

export const protectedRoutes = [
  {
    path: "/",
    element: <Protected />,
    children: [
      {
        path: "/",
        element: <Navigate to="/feed" />,
      },
      {
        path: "/feed",
        element: <Feed />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/friends",
        element: <Friends />,
      },
      { path: "*", element: <Navigate to="." /> },
    ],
  },
];
