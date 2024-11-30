import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditProductModal = ({ 
    show, 
    onHide, 
    product, 
    onSave, 
    onChange, 
    categories 
}) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={product.name}
                            onChange={(e) => onChange({ ...product, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={product.description}
                            onChange={(e) => onChange({ ...product, description: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Categories</Form.Label>
                        <Form.Select
                            multiple
                            value={product.categoryList}
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                onChange({ ...product, categoryList: selectedOptions });
                            }}
                        >
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Calories (per 100g)</Form.Label>
                        <Form.Control
                            type="number"
                            value={product.calories}
                            onChange={(e) => onChange({ ...product, calories: Number(e.target.value) })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Protein (g per 100g)</Form.Label>
                        <Form.Control
                            type="number"
                            value={product.protein}
                            onChange={(e) => onChange({ ...product, protein: Number(e.target.value) })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Fat (g per 100g)</Form.Label>
                        <Form.Control
                            type="number"
                            value={product.fat}
                            onChange={(e) => onChange({ ...product, fat: Number(e.target.value) })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Carbohydrates (g per 100g)</Form.Label>
                        <Form.Control
                            type="number"
                            value={product.carbohydrates}
                            onChange={(e) => onChange({ ...product, carbohydrates: Number(e.target.value) })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditProductModal;