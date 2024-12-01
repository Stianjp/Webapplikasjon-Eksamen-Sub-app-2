import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AVAILABLE_ALLERGENS = [
    "Milk", "Egg", "Peanut", "Soy", "Wheat", 
    "Tree Nut", "Shellfish", "Fish", "Sesame", "None"
];

const EditProductModal = ({ show, onHide, product, onChange, onSave, categories }) => {
    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!product?.name?.trim()) {
            errors.name = 'Name is required';
        }
        if (!product?.description?.trim()) {
            errors.description = 'Description is required';
        }
        if (!product?.categoryList?.length) {
            errors.categoryList = 'At least one category is required';
        }
        if (product?.calories === undefined || product?.calories < 0) {
            errors.calories = 'Valid calories value is required';
        }
        if (product?.protein === undefined || product?.protein < 0) {
            errors.protein = 'Valid protein value is required';
        }
        if (product?.carbohydrates === undefined || product?.carbohydrates < 0) {
            errors.carbohydrates = 'Valid carbohydrates value is required';
        }
        if (product?.fat === undefined || product?.fat < 0) {
            errors.fat = 'Valid fat value is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        
        let processedValue = value;
        if (type === 'number') {
            processedValue = value === '' ? 0 : parseFloat(value);
            if (isNaN(processedValue)) processedValue = 0;
        }
        
        onChange({
            ...product,
            [name]: processedValue
        });
    };

    const handleCategoryChange = (e) => {
        const selectedCategories = Array.from(e.target.selectedOptions, option => option.value);
        setValidationErrors(prev => ({ ...prev, categoryList: undefined }));
        onChange({
            ...product,
            categoryList: selectedCategories
        });
    };

    const handleAllergenChange = (allergen) => {
        let currentAllergens = product.allergens ? 
            product.allergens.split(',').map(a => a.trim()) : [];
        
        if (allergen === 'None') {
            currentAllergens = ['None'];
        } else {
            currentAllergens = currentAllergens.filter(a => a !== 'None');
            if (currentAllergens.includes(allergen)) {
                currentAllergens = currentAllergens.filter(a => a !== allergen);
            } else {
                currentAllergens.push(allergen);
            }
        }

        onChange({
            ...product,
            allergens: currentAllergens.join(', ')
        });
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave();
        }
    };

    const currentAllergens = product?.allergens ? 
        product.allergens.split(',').map(a => a.trim()) : [];

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {product?.id ? 'Edit Product' : 'Create Product'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group className="mb-3">
                        <Form.Label>Name*</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={product?.name || ''}
                            onChange={handleInputChange}
                            isInvalid={!!validationErrors.name}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {validationErrors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description*</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={product?.description || ''}
                            onChange={handleInputChange}
                            isInvalid={!!validationErrors.description}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {validationErrors.description}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Categories*</Form.Label>
                        <Form.Select
                            multiple
                            name="categoryList"
                            value={product?.categoryList || []}
                            onChange={handleCategoryChange}
                            isInvalid={!!validationErrors.categoryList}
                            required
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Hold Ctrl/Cmd to select multiple categories
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            {validationErrors.categoryList}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Calories*</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="calories"
                                    value={product?.calories ?? 0}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.1"
                                    isInvalid={!!validationErrors.calories}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.calories}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Protein (g)*</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="protein"
                                    value={product?.protein ?? 0}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.1"
                                    isInvalid={!!validationErrors.protein}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.protein}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fat (g)*</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="fat"
                                    value={product?.fat ?? 0}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.1"
                                    isInvalid={!!validationErrors.fat}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.fat}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Carbohydrates (g)*</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="carbohydrates"
                                    value={product?.carbohydrates ?? 0}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.1"
                                    isInvalid={!!validationErrors.carbohydrates}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.carbohydrates}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Allergens</Form.Label>
                        <Row className="mt-2">
                            {AVAILABLE_ALLERGENS.map((allergen) => (
                                <Col key={allergen} xs={12} sm={6} md={4}>
                                    <Form.Check
                                        type="checkbox"
                                        id={`allergen-${allergen}`}
                                        label={allergen}
                                        checked={currentAllergens.includes(allergen)}
                                        onChange={() => handleAllergenChange(allergen)}
                                        disabled={allergen !== 'None' && currentAllergens.includes('None')}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditProductModal;