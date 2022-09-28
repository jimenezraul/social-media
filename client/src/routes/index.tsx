
import { useRoutes } from "react-router-dom";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/users/userSlice";


export default function AppRoutes() {
  const user = useAppSelector(selectUser);

  const routes = user.isLoggedIn ? protectedRoutes : publicRoutes;
  const routing = useRoutes([...routes]);
  return <>{routing}</>;
}
