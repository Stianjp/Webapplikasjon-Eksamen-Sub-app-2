import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7067';

const CreateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryList: [],
        calories: '',
        protein: '',
        fat: '',
        carbohydrates: ''
    });

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/Products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch product');

            const data = await response.json();
            setFormData({
                name: data.name || '',
                description: data.description || '',
                categoryList: data.categoryList || [],
                calories: data.calories || '',
                protein: data.protein || '',
                fat: data.fat || '',
                carbohydrates: data.carbohydrates || ''
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product details');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (e) => {
        const categories = e.target.value.split(',').map(cat => cat.trim());
        setFormData(prev => ({
            ...prev,
            categoryList: categories
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem('token');
            const url = id 
                ? `${API_BASE_URL}/api/Products/${id}`
                : `${API_BASE_URL}/api/Products`;

            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    calories: parseFloat(formData.calories),
                    protein: parseFloat(formData.protein),
                    fat: parseFloat(formData.fat),
                    carbohydrates: parseFloat(formData.carbohydrates)
                })
            });

            if (!response.ok) throw new Error('Failed to save product');

            setSuccess(true);
            setTimeout(() => {
                navigate('/products');
            }, 1500);
        } catch (error) {
            console.error('Error saving product:', error);
            setError('Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4">
            <Card>
                <Card.Body>
                    <Card.Title>{id ? 'Edit Product' : 'Create New Product'}</Card.Title>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">
                        Product successfully {id ? 'updated' : 'created'}! Redirecting...
                    </Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Categories (comma-separated)</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.categoryList.join(', ')}
                                onChange={handleCategoryChange}
                                placeholder="e.g., Dairy, Organic, Vegan"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Calories</Form.Label>
                            <Form.Control
                                type="number"
                                name="calories"
                                value={formData.calories}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Protein (g)</Form.Label>
                            <Form.Control
                                type="number"
                                name="protein"
                                value={formData.protein}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fat (g)</Form.Label>
                            <Form.Control
                                type="number"
                                name="fat"
                                value={formData.fat}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Carbohydrates (g)</Form.Label>
                            <Form.Control
                                type="number"
                                name="carbohydrates"
                                value={formData.carbohydrates}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button 
                                type="submit" 
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (id ? 'Update Product' : 'Create Product')}
                            </Button>
                            <Button 
                                type="button" 
                                variant="secondary"
                                onClick={() => navigate(-1)}
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