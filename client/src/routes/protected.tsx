import { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { lazyImport } from "../utils/lazyImports";

import Navbar from "../components/Navbar";

const { Profile } = lazyImport(
  () => import("../features/users"),
  "Profile"
);

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
