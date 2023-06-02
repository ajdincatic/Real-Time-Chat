import { ChatList } from "react-chat-elements";
import moment from "moment";
import { useContext, useEffect } from "react";
import { getMyRooms, updateRoomsList } from "../redux/reducers/room";
import { useAppDispatch, useAppSelector } from "../shared/custom-hooks";
import { LoadingSpinner } from "./loading-spinner";
import { setSelectedRoom } from "../redux/reducers/auth";
import { SocketContext } from "../context/socket";

export const ChatRoomsList = () => {
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);

  const { user, selectedRoomId } = useAppSelector((state) => state.auth);
  const { loading, myRooms } = useAppSelector((state) => state.room);

  useEffect(() => {
    dispatch(getMyRooms());

    socket.on("update-rooms-list", (data) => {
      const newMessage = { ...data, sentByMe: data.senderUserId === user.id };
      dispatch(updateRoomsList(newMessage));
    });

    return () => {
      socket.off("update-rooms-list");
    };
  }, [dispatch, socket, user.id]);

  const renderChatList = () => {
    return myRooms
      ? myRooms.map((room) => {
          const { entityId, name, lastMessage } = room;
          const avatar = `https://picsum.photos/200`; // retreive random photo

          return {
            id: entityId,
            avatar,
            title: name,
            subtitle: lastMessage
              ? `${
                  lastMessage.sentByMe ? "You" : lastMessage.senderUsername
                }: ${lastMessage.message}`
              : "",
            date: lastMessage?.timestamp
              ? moment(lastMessage.timestamp).toDate()
              : null,
            className: "chat-list-item",
          };
        })
      : [];
  };

  const handleItemClick = (item: any) => {
    dispatch(setSelectedRoom({ id: item.id }));

    // leave old chat room
    if (selectedRoomId !== null) {
      socket.emit("remove-user-from-room", {
        userId: user.id,
        roomId: selectedRoomId,
      });
    }

    // enter new chat room
    socket.emit("assign-active-room-to-user", {
      userId: user.id,
      selectedRoomId: item.id,
    });
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ChatList
          id="chat-list"
          lazyLoadingImage="none"
          className="chat-list"
          dataSource={renderChatList()}
          onClick={handleItemClick}
        />
      )}
    </>
  );
};
