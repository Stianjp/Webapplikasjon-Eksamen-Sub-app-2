import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7067';

const AVAILABLE_ALLERGENS = [
    "Milk", "Egg", "Peanut", "Soy", "Wheat", "Tree Nut", "Shellfish", "Fish", "Sesame", "None"
];

const CreateProduct = () => {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Available categories - should match your backend
    const availableCategories = [
        "Meat", "Fish", "Vegetable", "Fruit", "Pasta", "Legume", "Drink"
    ];

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryList: [],
        calories: '',
        protein: '',
        fat: '',
        carbohydrates: '',
        allergens: ''
    });

    const validateForm = () => {
        const errors = {};
        if (!formData?.name?.trim()) errors.name = 'Name is required';
        if (!formData?.description?.trim()) errors.description = 'Description is required';
        if (!formData?.categoryList?.length) errors.categoryList = 'At least one category is required';
        if (formData?.calories === "" || formData?.calories < 0) errors.calories = 'Calories must be a positive number';
        if (formData?.protein === "" || formData?.protein < 0) errors.protein = 'Protein must be a positive number';
        if (formData?.fat === "" || formData?.fat < 0) errors.fat = 'Fat must be a positive number';
        if (formData?.carbohydrates === "" || formData?.carbohydrates < 0) errors.carbohydrates = 'Carbohydrates must be a positive number';
    
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    


    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAllergenChange = (allergen) => {
        setFormData(prev => {
            let currentAllergens = prev.allergens ? prev.allergens.split(',').map(a => a.trim()) : [];
            
            if (allergen === 'None') {
                // If 'None' is selected, clear all other allergens
                return {
                    ...prev,
                    allergens: 'None'
                };
            } else {
                // If any other allergen is selected, remove 'None'
                currentAllergens = currentAllergens.filter(a => a !== 'None');
                
                if (currentAllergens.includes(allergen)) {
                    currentAllergens = currentAllergens.filter(a => a !== allergen);
                } else {
                    currentAllergens.push(allergen);
                }

                return {
                    ...prev,
                    allergens: currentAllergens.join(', ')
                };
            }
        });
    };

    const handleCategoryChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData(prev => ({
            ...prev,
            categoryList: selectedOptions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('You must be logged in to create a product.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/Products/CreateProduct`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    calories: parseFloat(formData.calories),
                    protein: parseFloat(formData.protein),
                    fat: parseFloat(formData.fat),
                    carbohydrates: parseFloat(formData.carbohydrates)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create product');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/products');
            }, 1500);
        } catch (error) {
            console.error('Error creating product:', error);
            setError(error.message || 'Failed to create product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const currentAllergens = formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : [];

    return (
        <Container className="py-4">
            <Card>
                <Card.Body>
                    <Card.Title>Create New Product</Card.Title>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && (
                        <Alert variant="success">
                            Product successfully created! Redirecting to products page...
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>Name*</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter product name"
                            />
                            {validationErrors.name && (
                                <Form.Text className="text-danger">{validationErrors.name}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description*</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Enter product description"
                                rows={3}
                            />
                            {validationErrors.description && (
                                <Form.Text className="text-danger">{validationErrors.description}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Categories*</Form.Label>
                            <Form.Select
                                multiple
                                name="categoryList"
                                value={formData.categoryList}
                                onChange={handleCategoryChange}
                                required
                            >
                                {availableCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Hold Ctrl (Windows) or Command (Mac) to select multiple categories
                            </Form.Text>
                            {validationErrors.categoryList && (
                                <Form.Text className="text-danger">{validationErrors.categoryList}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Calories (per 100g)*</Form.Label>
                            <Form.Control
                                type="number"
                                name="calories"
                                value={formData.calories}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.1"
                                placeholder="Enter calories"
                            />
                            {validationErrors.calories && (
                                <Form.Text className="text-danger">{validationErrors.calories}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Protein (g per 100g)*</Form.Label>
                            <Form.Control
                                type="number"
                                name="protein"
                                value={formData.protein}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.1"
                                placeholder="Enter protein content"
                            />
                            {validationErrors.protein && (
                                <Form.Text className="text-danger">{validationErrors.protein}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fat (g per 100g)*</Form.Label>
                            <Form.Control
                                type="number"
                                name="fat"
                                value={formData.fat}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.1"
                                placeholder="Enter fat content"
                            />
                            {validationErrors.fat && (
                                <Form.Text className="text-danger">{validationErrors.fat}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Carbohydrates (g per 100g)*</Form.Label>
                            <Form.Control
                                type="number"
                                name="carbohydrates"
                                value={formData.carbohydrates}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.1"
                                placeholder="Enter carbohydrates content"
                            />
                            {validationErrors.carbohydrates && (
                                <Form.Text className="text-danger">{validationErrors.carbohydrates}</Form.Text>
                            )}
                        </Form.Group>

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

                        <div className="d-flex gap-2">
                            <Button 
                                type="submit" 
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Product'}
                            </Button>
                            <Button 
                                type="button" 
                                variant="secondary"
                                onClick={() => navigate('/products/my')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateProduct;