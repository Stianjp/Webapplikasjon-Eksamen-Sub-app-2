import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

// API endpoint for fetching product data
const API_BASE_URL = 'http://localhost:7067';

const ProductDetails = () => {
    // Get product ID from URL parameters
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [product, setProduct] = useState(null);        // Stores product data
    const [loading, setLoading] = useState(true);        // Tracks loading state
    const [error, setError] = useState(null);            // Stores error messages

    /**
     * Effect hook to fetch product details when component mounts
     * or when the product ID changes
     */
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/Products/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }

                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Loading state display
    if (loading) {
        return (
            <Container className="py-4">
                <div className="text-center">Loading product details...</div>
            </Container>
        );
    }

    // Error state display
    if (error) {
        return (
            <Container className="py-4">
                <div className="text-danger">{error}</div>
            </Container>
        );
    }

    // No product found state
    if (!product) {
        return (
            <Container className="py-4">
                <div>Product not found</div>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Card>
                <Card.Body>
                    {/* Header section with title, categories, and back button */}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <Card.Title className="h2 mb-3">{product.name}</Card.Title>
                            {/* Display categories as badges */}
                            <div className="mb-3">
                                {product.categoryList?.map((category, index) => (
                                    <Badge 
                                        bg="secondary" 
                                        className="me-2" 
                                        key={index}
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <Button 
                            variant="secondary"
                            onClick={() => navigate(-1)}
                        >
                            Back to Products
                        </Button>
                    </div>

                    {/* Product description */}
                    <Card.Text className="mb-4">
                        {product.description}
                    </Card.Text>

                    {/* Nutritional information section */}
                    <h4 className="mb-3">Nutritional Information</h4>
                    <Row className="g-4">
                        {/* Calories card */}
                        <Col sm={6} md={3}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title className="h5 text-center">Calories</Card.Title>
                                    <Card.Text className="text-center h3">
                                        {product.calories}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Protein card */}
                        <Col sm={6} md={3}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title className="h5 text-center">Protein</Card.Title>
                                    <Card.Text className="text-center h3">
                                        {product.protein}g
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Fat card */}
                        <Col sm={6} md={3}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title className="h5 text-center">Fat</Card.Title>
                                    <Card.Text className="text-center h3">
                                        {product.fat}g
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Carbohydrates card */}
                        <Col sm={6} md={3}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title className="h5 text-center">Carbohydrates</Card.Title>
                                    <Card.Text className="text-center h3">
                                        {product.carbohydrates}g
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Additional information section */}
                    <div className="mt-4">
                        <h4 className="mb-3">Additional Information</h4>
                        <p><strong>Producer ID:</strong> {product.producerId}</p>
                        <p><strong>Last Updated:</strong> {new Date(product.lastModified).toLocaleDateString()}</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProductDetails;