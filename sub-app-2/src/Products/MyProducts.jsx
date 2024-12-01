import React, { useState, useEffect } from 'react';
import { Container, Form, Alert, Button, Table, Badge } from 'react-bootstrap';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';

const API_BASE_URL = 'http://localhost:7067';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    
    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);

    useEffect(() => {
        fetchMyProducts();
    }, [selectedCategory, sortField, sortDirection]);

    const fetchMyProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('You are not logged in. Please log in to view your products.');
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/Products/user-products?category=${selectedCategory}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setProducts(data.products || []);
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setEditedProduct({
            id: product.id,
            name: product.name,
            description: product.description,
            categoryList: product.categoryList,
            calories: product.calories,
            protein: product.protein,
            carbohydrates: product.carbohydrates,
            fat: product.fat,
            allergens: product.allergens,
            producerId: product.producerId
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleEditSave = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(
                `${API_BASE_URL}/api/Products/UpdateProduct${editedProduct.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editedProduct),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            setProducts(products.map(p => 
                p.id === editedProduct.id ? editedProduct : p
            ));
            setShowEditModal(false);
            setSelectedProduct(null);
            setEditedProduct(null);
            await fetchMyProducts(); // Refresh the list

        } catch (error) {
            console.error('Error updating product:', error);
            setError('Failed to update product. Please try again.');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(
                `${API_BASE_URL}/api/Products/DeleteProduct${selectedProduct.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setProducts(products.filter(p => p.id !== selectedProduct.id));
            setShowDeleteModal(false);
            setSelectedProduct(null);

        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product. Please try again.');
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedProducts = products
        .filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortDirection === 'asc') {
                return a[sortField] > b[sortField] ? 1 : -1;
            } else {
                return a[sortField] < b[sortField] ? 1 : -1;
            }
        });

    const renderSortIcon = (field) => {
        if (sortField !== field) return '↕️';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>My Products</h1>
                <Badge bg="primary" className="fs-6">
                    {products.length} Products
                </Badge>
            </div>

            <div className="mb-4">
                <Button 
                    variant="success"
                    className="mb-3"
                    onClick={() => window.location.href = '/products/create'}
                >
                    Add New Product
                </Button>

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
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </div>

            {error && (
                <Alert variant="danger" className="mb-4">
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
                                <th onClick={() => handleSort('name')}>
                                    Name {renderSortIcon('name')}
                                </th>
                                <th>Description</th>
                                <th>Categories</th>
                                <th onClick={() => handleSort('calories')}>
                                    Calories {renderSortIcon('calories')}
                                </th>
                                <th onClick={() => handleSort('protein')}>
                                    Protein {renderSortIcon('protein')}
                                </th>
                                <th onClick={() => handleSort('fat')}>
                                    Fat {renderSortIcon('fat')}
                                </th>
                                <th onClick={() => handleSort('carbohydrates')}>
                                    Carbs {renderSortIcon('carbohydrates')}
                                </th>
                                <th>Allergens</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.categoryList.join(', ')}</td>
                                    <td>{product.calories}</td>
                                    <td>{product.protein}g</td>
                                    <td>{product.fat}g</td>
                                    <td>{product.carbohydrates}g</td>
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
