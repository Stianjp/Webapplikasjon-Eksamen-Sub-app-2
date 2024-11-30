import React from 'react';
import { Modal, Button, } from 'react-bootstrap';

const DeleteProductModal = ({ show, onHide, onConfirm, productName }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete {productName}? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Delete Product
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteProductModal;

