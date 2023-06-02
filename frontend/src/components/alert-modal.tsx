import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const AlertModal = ({
  show,
  closeAction,
  confirmAction,
  confirmText,
  confirmColor,
}) => (
  <Modal show={show} onHide={closeAction}>
    <Modal.Header closeButton>
      <Modal.Title>Warning</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={closeAction}>
        Close
      </Button>
      <Button variant={confirmColor} onClick={confirmAction}>
        {confirmText}
      </Button>
    </Modal.Footer>
  </Modal>
);
