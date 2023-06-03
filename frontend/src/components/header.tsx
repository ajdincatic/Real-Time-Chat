import { useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { logout } from "../redux/reducers/auth";
import { routes } from "../shared/constants";
import { useAppDispatch } from "../shared/custom-hooks";
import styles from "./styles/header.module.css";
import { AlertModal } from "./alert-modal";

export const Header = ({ user }) => {
  const dispatch = useAppDispatch();

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      {showAlertModal && (
        <AlertModal
          show={showAlertModal}
          closeAction={() => setShowAlertModal(false)}
          confirmAction={handleLogout}
          confirmText={"Logout"}
          confirmColor={"danger"}
        />
      )}
      <Navbar
        bg="light"
        expand="lg"
        expanded={expanded}
        className={styles.navbar}
      >
        <Container>
          <Link to={routes.ROOMS} onClick={() => setExpanded(false)}>
            <Navbar.Brand>
              <img
                src="/chat.png"
                height="52"
                className="d-inline-block align-top"
                alt="Chat"
              />
            </Navbar.Brand>
          </Link>
          {user && (
            <>
              <Navbar.Toggle
                aria-controls="navbarScroll"
                onClick={() => setExpanded(!expanded)}
              />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0"
                  style={{ maxHeight: "250px" }}
                  navbarScroll
                ></Nav>
                <Nav>
                  <NavDropdown
                    className={styles.navItem}
                    title={`Hi, ${user.username}`}
                    id="navbarScrollingDropdown"
                  >
                    <NavDropdown.Item onClick={() => setShowAlertModal(true)}>
                      Log Out
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </>
  );
};
