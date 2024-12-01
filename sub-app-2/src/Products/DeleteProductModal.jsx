import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteProductModal = ({ show, onHide, onConfirm, product }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the product: <strong>{product?.name}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => onConfirm()}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProductModal;