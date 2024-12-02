import React, { useState, useEffect } from 'react';
import { Container, Form, Alert, Button, Table, Badge, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';

const API_BASE_URL = 'http://localhost:7067';

const MyProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);

    const fetchMyProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/products');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/Products/user-products`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/products');
                    return;
                }
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            console.log('Response data:', data);
            setProducts(data.products || []);
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load your products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setEditedProduct({ ...product });
        setShowEditModal(true);
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleEditSave = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Products/UpdateProduct${editedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedProduct),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            await fetchMyProducts();
            setShowEditModal(false);
            setSelectedProduct(null);
            setEditedProduct(null);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to update product. Please try again.');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Products/DeleteProduct${selectedProduct.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            await fetchMyProducts();
            setShowDeleteModal(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to delete product. Please try again.');
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || product.categoryList?.includes(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <Container>
            <Card>
                <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>My Products</h1>
                <Badge bg="primary">{products.length} Products</Badge>
            </div>

            <Button 
                variant="success" 
                className="mb-3"
                onClick={() => navigate('/products/add')}
            >
                Add New Product
            </Button>

            <div className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Filter by Category</Form.Label>
                    <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </div>

            {error && (
                <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Categories</th>
                                <th>Calories</th>
                                <th>Protein (g)</th>
                                <th>Fat (g)</th>
                                <th>Carbs (g)</th>
                                <th>Allergens</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.categoryList?.join(', ')}</td>
                                    <td>{product.calories}</td>
                                    <td>{product.protein}</td>
                                    <td>{product.fat}</td>
                                    <td>{product.carbohydrates}</td>
                                    <td>{product.allergens || 'None'}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEditClick(product)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick(product)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            </Card.Body>
            </Card>
            

            <EditProductModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                product={editedProduct}
                onChange={setEditedProduct}
                onSave={handleEditSave}
                categories={categories}
            />

            <DeleteProductModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                product={selectedProduct}
            />
        </Container>
    );
};

export default MyProducts;