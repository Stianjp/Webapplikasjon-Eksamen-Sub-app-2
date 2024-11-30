// MyProducts.jsx
import React, { useState, useEffect } from 'react';
import { Container, Form, Alert, Button, Table } from 'react-bootstrap';
import { EditProductModal, DeleteProductModal } from './Products';

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
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState({
        name: '',
        description: '',
        categoryList: [],
        calories: '',
        protein: '',
        fat: '',
        carbohydrates: ''
    });

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
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            );

            if (response.status === 401) {
                setError('Your session has expired. Please log in again.');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data.products);
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, [selectedCategory]);

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setEditedProduct({
            id: product.id,
            name: product.name,
            description: product.description,
            categoryList: product.categoryList,
            calories: product.calories,
            protein: product.protein,
            fat: product.fat,
            carbohydrates: product.carbohydrates
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You are not logged in. Please log in to edit products.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/Products/UpdateProducts${selectedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    id: selectedProduct.id,
                    ...editedProduct
                })
            });

            if (response.status === 401) {
                setError('Your session has expired. Please log in again.');
                return;
            }

            if (response.status === 403) {
                setError('You do not have permission to edit this product.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update the product.');
                return;
            }

            await fetchMyProducts(); // Refresh the products list
            handleCloseEditModal();
        } catch (error) {
            console.error('Error updating product:', error);
            setError('An unexpected error occurred while updating the product.');
        }
    };

    const handleDeleteProduct = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmation = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You are not logged in. Please log in to delete products.');
            return;
        }

        try {
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

            await fetchMyProducts(); // Refresh the products list
            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product. Please try again.');
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedProduct(null);
        setEditedProduct({
            name: '',
            description: '',
            categoryList: [],
            calories: '',
            protein: '',
            fat: '',
            carbohydrates: ''
        });
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedProduct(null);
    };

    const filteredProducts = products
        .filter(product =>
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <Container className="mt-4">
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <div className="mb-4">
                <h2>My Products</h2>
                <div className="d-flex justify-content-between align-items-center">
                    <Form.Group className="w-25">
                        <Form.Control
                            type="search"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="w-25">
                        <Form.Select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Categories</th>
                            <th>Calories</th>
                            <th>Protein</th>
                            <th>Fat</th>
                            <th>Carbs</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.categoryList.join(', ')}</td>
                                <td>{product.calories}</td>
                                <td>{product.protein}</td>
                                <td>{product.fat}</td>
                                <td>{product.carbohydrates}</td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditProduct(product)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteProduct(product)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <EditProductModal
                show={showEditModal}
                onHide={handleCloseEditModal}
                product={editedProduct}
                onChange={setEditedProduct}
                onSave={handleSaveEdit}
                categories={categories}
            />

            <DeleteProductModal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                onConfirm={handleDeleteConfirmation}
                productName={selectedProduct?.name}
            />
        </Container>
    );
};

export default MyProducts;

    