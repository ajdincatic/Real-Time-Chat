import { Container } from "react-bootstrap";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/header";
import { RoutesWrapper } from "./components/routes-wrapper";
import { useAppSelector } from "./shared/custom-hooks";
import { SocketContext, socket } from "./context/socket";

const App = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      {user && <Header user={user} />}

      <Container fluid className="p-0">
        <SocketContext.Provider value={socket}>
          <RoutesWrapper isLoggedIn={user !== null} />
        </SocketContext.Provider>
      </Container>
    </BrowserRouter>
  );
};

export default App;
