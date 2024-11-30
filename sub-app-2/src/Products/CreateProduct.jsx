import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7067';

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
        carbohydrates: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (e) => {
        // Get all selected options from the multiple select
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
                navigate('/my-products');
            }, 1500);
        } catch (error) {
            console.error('Error creating product:', error);
            setError(error.message || 'Failed to create product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

                    <Form onSubmit={handleSubmit}>
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
                                onClick={() => navigate('/my-products')}
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