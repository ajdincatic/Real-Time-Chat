import { Container } from "react-bootstrap";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/header";
import { RoutesWrapper } from "./components/routes-wrapper";
import { useAppSelector } from "./shared/custom-hooks";
import { SocketContext, socket } from "./context/socket";
import { useEffect } from "react";

const App = () => {
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user !== null) {
      socket.connect();

      socket.emit("assign-socket-to-user", {
        userId: user.id,
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <BrowserRouter>
      {user && <Header user={user} />}

      <Container>
        <SocketContext.Provider value={socket}>
          <RoutesWrapper isLoggedIn={user !== null} />
        </SocketContext.Provider>
      </Container>
    </BrowserRouter>
  );
};

export default App;
