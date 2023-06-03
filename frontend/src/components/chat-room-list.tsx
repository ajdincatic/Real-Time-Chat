import { ChatList } from "react-chat-elements";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { getMyRooms, updateRoomsList } from "../redux/reducers/room";
import { useAppDispatch, useAppSelector } from "../shared/custom-hooks";
import { LoadingSpinner } from "./loading-spinner";
import { SocketContext } from "../context/socket";
import { useNavigate } from "react-router";
import { routes, endpoints } from "../shared/constants";
import { Col, Container, Row } from "react-bootstrap";
import { getUsers } from "../redux/reducers/user";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";

export const ChatRoomsList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [selected, setSelected] = useState([]);

  const { user } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.user);
  const { loading, myRooms } = useAppSelector((state) => state.room);

  useEffect(() => {
    dispatch(getMyRooms());
    dispatch(getUsers());

    socket.on("update-rooms-list", (data) => {
      const newMessage = { ...data, sentByMe: data.senderUserId === user.id };
      dispatch(updateRoomsList(newMessage));
    });

    return () => {
      socket.off("update-rooms-list");
    };
  }, [dispatch, socket, user]);

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
          };
        })
      : [];
  };

  const handleItemClick = (item: any) => {
    navigate(`${routes.SELECTED_ROOM}/${item.id}`);
  };

  const handleSearchChange = async (selected: any) => {
    if (selected.length > 0) {
      const searchParameter = selected[0];

      const response = await axios.get(endpoints.GET_10N1_ROOM_BY_MEMBERS, {
        params: {
          secondUserId: searchParameter.entityId,
        },
      });

      navigate(
        `${routes.SELECTED_ROOM}/${
          response.data.room?.entityId ?? `new-${searchParameter.entityId}`
        }`
      );
    }
    setSelected(selected);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Container fluid className="my-4 p-0">
            <Row>
              <Col>
                <Typeahead
                  id="search-input"
                  labelKey="username"
                  multiple={false}
                  options={users}
                  onChange={handleSearchChange}
                  selected={selected}
                  placeholder="Search users..."
                />
              </Col>
            </Row>
          </Container>
          {myRooms.length <= 0 && (
            <p className="text-center mt-5">
              You don't have any chat rooms. Write your first message.
            </p>
          )}
          <ChatList
            id="chat-list"
            lazyLoadingImage="none"
            className="chat-list"
            dataSource={renderChatList()}
            onClick={handleItemClick}
          />
        </>
      )}
    </>
  );
};
