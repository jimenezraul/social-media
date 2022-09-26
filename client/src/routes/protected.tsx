import { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { lazyImport } from "../utils/lazyImports";

import Navbar from "../components/Navbar";

const { Profile } = lazyImport(
  () => import("./protectedRoutes/Profile"),
  "Profile"
);

const Protected = () => {
  return (
    <div>
      <Navbar />
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center"></div>
        }
      >
        <Outlet />
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
