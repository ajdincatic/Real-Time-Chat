import { ChatRoomsList } from "./chat-room-list";
import { ChatRoom } from "./chat-room";
import { Col, Container, Row } from "react-bootstrap";
import { useContext, useEffect } from "react";
import { SocketContext } from "../context/socket";
import { useAppSelector } from "../shared/custom-hooks";

export const HomePageUser = () => {
  const socket = useContext(SocketContext);

  const { user, selectedRoomId } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user !== null) {
      socket.connect();

      socket.emit("assign-socket-to-user", {
        userId: user.id,
      });
    }

    if (selectedRoomId !== null) {
      socket.emit("assign-active-room-to-user", {
        userId: user.id,
        selectedRoomId,
      });
    }

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user]);

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="chat-rooms p-0">
          <ChatRoomsList />
        </Col>
        <Col md={9} className="chat-section p-0">
          <ChatRoom />
        </Col>
      </Row>
    </Container>
  );
};
