import { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { lazyImport } from "../utils/lazyImports";

import Navbar from "../components/Navbar";

const { Profile } = lazyImport(
  () => import("../features/users/"),
  "Profile"
);

const Protected = () => {
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col">
      <Navbar />
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center"></div>
        }
      >
        <div className="w-full h-full flex flex-1 items-center justify-center">
          <Outlet />
        </div>
      </Suspense>
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
        element: <Profile />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/feed",
        element: <Profile />,
      },
      { path: "*", element: <Navigate to="." /> },
    ],
  },
];
