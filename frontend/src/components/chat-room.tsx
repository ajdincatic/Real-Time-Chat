import { useContext, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../shared/custom-hooks";
import {
  addMessage,
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

export const ChatRoom = () => {
  const messageListRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);

  const { user, selectedRoomId } = useAppSelector((state) => state.auth);
  const { loading, room, messages } = useAppSelector(
    (state) => state.roomMessges
  );
  const [message, setMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (selectedRoomId !== null) {
      dispatch(getRoomMessages({ roomId: selectedRoomId }));

      socket.on("update-messages-list", (data) => {
        const newMessage = { ...data, sentByMe: data.senderUserId === user.id };
        dispatch(addMessage(newMessage));
      });
    }

    return () => {
      socket.off("update-messages-list");
    };
  }, [dispatch, selectedRoomId, user, socket]);

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

  const handleMessageChange = (event: any) => {
    setIsDisabled(isNullOrEmpty(event.target.value));
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (isDisabled) return;

    await sendMessage(message, selectedRoomId);

    setMessage("");
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {selectedRoomId && (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderData}>
                  <h2>{room?.name}</h2>
                  <p>Online</p>
                </div>
              </div>

              <div className={styles.chatMessages}>
                {messages?.length > 0 ? (
                  <MessageList
                    referance={messageListRef}
                    className="scrollable"
                    toBottomHeight={0}
                    lockable={true}
                    dataSource={renderMessagesList()}
                  />
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
          )}
        </>
      )}
    </>
  );
};
