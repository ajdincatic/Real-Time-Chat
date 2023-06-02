import { Navigate, Route, Routes } from "react-router";
import { routes } from "../shared/constants";
import { HomePageUser } from "./home-page-user";
import { Login } from "./login";

export const RoutesWrapper = ({ isLoggedIn }) => (
  <Routes>
    {!isLoggedIn ? (
      <>
        <Route index path={routes.LOGIN} element={<Login />}></Route>
      </>
    ) : (
      <>
        <Route index path={routes.HOME} element={<HomePageUser />}></Route>
      </>
    )}

    <Route path="*" element={<Navigate to={"/"} />}></Route>
  </Routes>
);
