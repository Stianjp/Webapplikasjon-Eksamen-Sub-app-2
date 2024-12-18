import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteProductModal = ({ 
  //Metodes used in different components for showing the Module
  show, onHide, onConfirm, productName }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the product "{productName}"?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProductModal;
