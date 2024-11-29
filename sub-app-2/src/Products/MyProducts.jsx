import React, { useState, useEffect } from 'react';
import { Container, Form, Alert, Button, Table, Modal } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:7067';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('Name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showEditModal, setShowEditModal] = useState(false); // For showing the Edit Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false); // For showing the Delete Confirmation Modal
    const [selectedProduct, setSelectedProduct] = useState(null); // For storing selected product for editing or deleting
    const [editedProduct, setEditedProduct] = useState({
        name: '',
        description: '',
        category: '',
        calories: '',
        protein: '',
        fat: '',
        carbohydrates: '',
    });

    const fetchMyProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found.');
                setError('You are not logged in. Please log in to view your products.');
                return;
            }
            console.log('Using token:', token);

            const response = await fetch(`${API_BASE_URL}/api/Products/user-products?category=${selectedCategory}&sortOrder=${sortOrder}&sortDirection=${sortDirection}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.status === 401) {
                console.error('Unauthorized.');
                setError('You are not authorized. Please log in again.');
                return;
            }

            if (!response.ok) {
                console.error(`Error fetching products: ${response.status} ${response.statusText}`);
                setError('Failed to fetch your products. Please try again later.');
                return;
            }

            const data = await response.json();
            console.log('Fetched products and categories:', data);
            setProducts(data.products || []);
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Unexpected error fetching products:', error);
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setEditedProduct({
            name: product.name,
            description: product.description,
            category: product.category,
            calories: product.calories,
            protein: product.protein,
            fat: product.fat,
            carbohydrates: product.carbohydrates,
        });
        setShowEditModal(true);
    };

    const handleDeleteProduct = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true); // Show the delete confirmation modal
    };

    const handleDeleteConfirmation = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You are not logged in. Please log in to delete products.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/Products/${selectedProduct.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                console.error('Error deleting product:', response.statusText);
                setError('Failed to delete the product. Please try again later.');
                return;
            }

            // Remove the product from the UI
            setProducts(prevProducts =>
                prevProducts.filter(product => product.id !== selectedProduct.id)
            );

            handleCloseDeleteModal();
        } catch (error) {
            console.error('Unexpected error deleting product:', error);
            setError('An unexpected error occurred while deleting the product. Please try again later.');
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedProduct(null);
        setEditedProduct({
            name: '',
            description: '',
            category: '',
            calories: '',
            protein: '',
            fat: '',
            carbohydrates: '',
        });
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedProduct(null);
    };

    const handleSaveEdit = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You are not logged in. Please log in to edit products.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/Products/${selectedProduct.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(editedProduct),
            });

            if (!response.ok) {
                console.error('Error updating product:', response.statusText);
                setError('Failed to update the product. Please try again later.');
                return;
            }

            // Update the products list in the UI
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === selectedProduct.id ? { ...product, ...editedProduct } : product
                )
            );

            handleCloseEditModal();
        } catch (error) {
            console.error('Unexpected error updating product:', error);
            setError('An unexpected error occurred while updating the product. Please try again later.');
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, [selectedCategory, sortOrder, sortDirection]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const clearCategoryFilter = () => {
        setSelectedCategory('');
    };

    const handleSort = (field) => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortOrder(field);
        setSortDirection(newDirection);
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container>
            <div className="section-container">
                <h1>My Products</h1>
                <div className="d-flex justify-content-between align-items-center">
                    <Button
                        className="btn btn-primary mt-3"
                        onClick={() => window.location.href = '/products/add'}
                    >
                        Add new product
                    </Button>
                    <span className="badge bg-warning me-2">
                        {products.length} Products
                    </span>
                </div>

                {/* Category Filter */}
                <div className="mt-3">
                    <Form className="d-flex align-items-center">
                        <Form.Label htmlFor="category" className="me-2 fw-bold mb-0">
                            Filter by Category:
                        </Form.Label>
                        <Form.Select
                            id="category"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="me-2"
                            style={{ width: 'auto' }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Form.Select>
                        <Button
                            variant="primary"
                            onClick={fetchMyProducts}
                            className="me-2"
                        >
                            Filter
                        </Button>
                        {selectedCategory && (
                            <Button
                                variant="secondary"
                                onClick={clearCategoryFilter}
                            >
                                Clear Filter
                            </Button>
                        )}
                    </Form>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-container mt-3">
                <Form.Control
                    type="text"
                    placeholder="Search for a product..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <hr />

            {/* Product Table */}
            <div className="mt-3">
                {error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('Name')}>Name</th>
                                <th onClick={() => handleSort('Description')}>Description</th>
                                <th>Category</th>
                                <th onClick={() => handleSort('Calories')}>Calories</th>
                                <th onClick={() => handleSort('Protein')}>Protein</th>
                                <th onClick={() => handleSort('Fat')}>Fat</th>
                                <th onClick={() => handleSort('Carbohydrates')}>Carbs</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.category}</td>
                                    <td>{product.calories}</td>
                                    <td>{product.protein}</td>
                                    <td>{product.fat}</td>
                                    <td>{product.carbohydrates}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteProduct(product)}
                                            className="ms-2"
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedProduct.name}
                                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedProduct.description}
                                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                value={editedProduct.category}
                                onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Calories (kcal)</Form.Label>
                            <Form.Control
                                type="number"
                                value={editedProduct.calories}
                                onChange={(e) => setEditedProduct({ ...editedProduct, calories: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Protein (g)</Form.Label>
                            <Form.Control
                                type="number"
                                value={editedProduct.protein}
                                onChange={(e) => setEditedProduct({ ...editedProduct, protein: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fat (g)</Form.Label>
                            <Form.Control
                                type="number"
                                value={editedProduct.fat}
                                onChange={(e) => setEditedProduct({ ...editedProduct, fat: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Carbohydrates (g)</Form.Label>
                            <Form.Control
                                type="number"
                                value={editedProduct.carbohydrates}
                                onChange={(e) => setEditedProduct({ ...editedProduct, carbohydrates: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Product Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the product: <strong>{selectedProduct?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmation}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyProducts;
