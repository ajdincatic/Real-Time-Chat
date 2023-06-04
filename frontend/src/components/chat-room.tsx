import { useContext, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../shared/custom-hooks";
import {
  addMessage,
  createRoom,
  getRoomMessages,
  sendMessage,
} from "../redux/reducers/room-messages";
import { MessageList } from "react-chat-elements";
import { LoadingSpinner } from "./loading-spinner";
import styles from "./styles/chat-room.module.css";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { Message } from "../shared/interfaces";
import { SocketContext } from "../context/socket";
import { isNullOrEmpty } from "../shared/helpers";
import { useNavigate, useParams } from "react-router";
import { routes } from "../shared/constants";
import ScrollableFeed from "react-scrollable-feed";

export const ChatRoom = () => {
  const messageListRef = useRef(null);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);
  const [roomIdParam, setRoomIdParam] = useState(null);
  const [userIdParam, setUserIdParam] = useState(null);
  const { user } = useAppSelector((state) => state.auth);
  const { loading, room, messages } = useAppSelector(
    (state) => state.roomMessges
  );
  const [message, setMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const splitParam = roomId.split("-");

    if (splitParam[0] !== "new") {
      dispatch(getRoomMessages({ roomId }));

      socket.emit("assign-active-room-to-user", {
        userId: user.id,
        roomId: roomId,
      });

      socket.on("update-messages-list", (data) => {
        const newMessage = { ...data, sentByMe: data.senderUserId === user.id };
        dispatch(addMessage(newMessage));
      });

      return () => {
        socket.off("update-messages-list");
        socket.emit("remove-user-from-room", {
          userId: user.id,
          roomId,
        });
      };
    } else {
      setRoomIdParam(splitParam[0]);
      setUserIdParam(splitParam[1]);
    }

    scrollToBottom();
  }, [dispatch, roomId, user, socket]);

  const renderMessagesList = (): any[] => {
    return messages
      ? messages.map((message: Message) => {
          return {
            title: message.sentByMe ? "You" : message.senderUsername,
            position: !message.sentByMe ? "left" : "right",
            type: "text",
            text: message.message,
            date: message.timestamp,
          };
        })
      : [];
  };

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const handleMessageChange = (event: any) => {
    setIsDisabled(isNullOrEmpty(event.target.value));
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (isDisabled) return;

    if (roomIdParam !== "new") {
      await sendMessage(message, roomId);
    } else {
      const response = await createRoom("", [userIdParam]);
      await sendMessage(message, response.id);

      navigate(`${routes.SELECTED_ROOM}/${response.id}`);
    }

    setMessage("");
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <>
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderData}>
                <h2>{roomIdParam !== "new" ? room?.name : "New room"}</h2>
                <p>Online</p>
              </div>
            </div>

            <div className={styles.chatMessages}>
              {messages?.length > 0 && roomIdParam !== "new" ? (
                <ScrollableFeed>
                  <MessageList
                    referance={messageListRef}
                    toBottomHeight={0}
                    lockable={true}
                    dataSource={renderMessagesList()}
                  />
                </ScrollableFeed>
              ) : (
                <p className="text-center mt-5">Write the first message...</p>
              )}
            </div>

            <div className={styles.chatInputWrapper}>
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Type message..."
                  value={message}
                  onChange={handleMessageChange}
                />
                <Button
                  disabled={isDisabled}
                  variant="primary"
                  onClick={handleSendMessage}
                >
                  Send
                </Button>
              </InputGroup>
            </div>
          </>
        </>
      )}
    </>
  );
};
