import { useRoutes } from "react-router-dom";
import { Landing } from "../features/misc";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

const user: User = null

export default function AppRoutes() {
  const commonRoutes = [
    {
      path: "/",
      element: <Landing />,
    },
  ];
  const routes = user ? protectedRoutes : publicRoutes;
  const routing = useRoutes([...routes, ...commonRoutes]);
  return <>{routing}</>;
}
