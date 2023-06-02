import { Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import styles from "./styles/loading-spinner.module.css";

export const LoadingSpinner = () => (
  <Container className={styles.container}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Container>
);
