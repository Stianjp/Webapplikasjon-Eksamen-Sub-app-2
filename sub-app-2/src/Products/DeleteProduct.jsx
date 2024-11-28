import React, { useState, useEffect } from 'react';
import { Container, Card, Button , Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from './mockDataProducts';

const DeleteProduct = () => {
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