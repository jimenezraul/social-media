import { lazyImport } from "../utils/lazyImports";

const { PublicRoutes } = lazyImport(
  () => import("./publicRoutes"),
  "PublicRoutes"
);

export const publicRoutes = [
  {
    path: "/login/*",
    element: <PublicRoutes />,
  },
];
