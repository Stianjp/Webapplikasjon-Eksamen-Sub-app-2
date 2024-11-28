import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from './mockDataProducts';

const DeleteProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Find product from mock data
        const foundProduct = mockProducts.find(p => p.id === parseInt(id));
        setProduct(foundProduct);
    }, [id]);

    const handleDelete = async () => {
        // Add your delete logic here
        // For now, just navigate back
        navigate(-1);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (!product) return <Container>Product not found</Container>;

    return (
        <Container className="py-4">
            <Card>
                <Card.Body>
                    <Card.Title>Delete Product</Card.Title>
                    <Card.Text>
                        Are you sure you want to delete "{product.name}"?
                        This action cannot be undone.
                    </Card.Text>
                    <div className="d-flex gap-2">
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DeleteProducts;