import { Navigate, Route, Routes } from "react-router";
import { routes } from "../shared/constants";
import { Login } from "./login";
import { ChatRoomsList } from "./chat-room-list";
import { ChatRoom } from "./chat-room";

export const RoutesWrapper = ({ isLoggedIn }) => (
  <Routes>
    {!isLoggedIn ? (
      <>
        <Route index path={routes.LOGIN} element={<Login />}></Route>
      </>
    ) : (
      <>
        <Route index path={routes.ROOMS} element={<ChatRoomsList />}></Route>
        <Route
          index
          path={`${routes.SELECTED_ROOM}`}
          element={<ChatRoom />}
        ></Route>
      </>
    )}

    <Route path="*" element={<Navigate to={"/"} />}></Route>
  </Routes>
);
