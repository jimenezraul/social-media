
import { useRoutes } from "react-router-dom";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/users/userSlice";
import { useAppDispatch } from "../app/hooks";


export default function AppRoutes() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  console.log(user)
  const routes = user.isLoggedIn ? protectedRoutes : publicRoutes;
  const routing = useRoutes([...routes]);
  return <>{routing}</>;
}
