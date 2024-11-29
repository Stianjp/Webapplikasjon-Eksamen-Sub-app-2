import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7067';

const DeleteProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/Products/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch product');
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

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/Products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            navigate('/products');
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product');
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (loading) return <Container>Loading...</Container>;
    if (error) return <Container className="text-danger">{error}</Container>;
    if (!product) return <Container>Product not found</Container>;

    return (
        <Container className="py-4">
             <Card>
                <Card.Body>
                    <Card.Title className="mb-4">Delete Product</Card.Title>
                    
                    <Table striped bordered>
                        <tbody>
                            <tr>
                                <th>Name:</th>
                                <td>{product.name}</td>
                            </tr>
                            <tr>
                                <th>Categories:</th>
                                <td>{product.categoryList?.join(', ') || 'No categories'}</td>
                            </tr>
                            <tr>
                                <th>Description:</th>
                                <td>{product.description}</td>
                            </tr>
                            <tr>
                                <th>Calories:</th>
                                <td>{product.calories}</td>
                            </tr>
                            <tr>
                                <th>Protein:</th>
                                <td>{product.protein}g</td>
                            </tr>
                            <tr>
                                <th>Fat:</th>
                                <td>{product.fat}g</td>
                            </tr>
                            <tr>
                                <th>Carbohydrates:</th>
                                <td>{product.carbohydrates}g</td>
                            </tr>
                            <tr>
                                <th>Producer ID:</th>
                                <td>{product.producerId}</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Card.Text className="text-danger mt-4">
                        Are you sure you want to delete this product? This action cannot be undone.
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

export default DeleteProduct;