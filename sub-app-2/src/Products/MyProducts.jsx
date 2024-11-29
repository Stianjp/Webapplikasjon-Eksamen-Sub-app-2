import React, { useState, useEffect } from 'react';
import { Container, Form, Alert, Button, Table } from 'react-bootstrap';

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

            // Fetch user products with category filter and sorting
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

    const deleteProduct = async (productId) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You are not logged in. Please log in to delete products.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/Products/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                console.error('Error deleting product:', response.statusText);
                setError('Failed to delete the product. Please try again later.');
                return;
            }

            // Filter out the deleted product from the products array
            setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        } catch (error) {
            console.error('Unexpected error deleting product:', error);
            setError('An unexpected error occurred while deleting the product. Please try again later.');
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
                        <img src={`${process.env.PUBLIC_URL}/icons/plus-solid.svg`} alt="add new product" className="icon" />
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
                    <div className="text-center">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        {filteredProducts.length === 0 ? (
                            <Alert variant="info">
                                No products found for the selected category or search query.
                            </Alert>
                        ) : (
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>
                                            <a
                                                role="button"
                                                onClick={() => handleSort('Name')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Name
                                                {sortOrder === 'Name' && (
                                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                                )}
                                            </a>
                                        </th>
                                        <th>
                                            <a
                                                role="button"
                                                onClick={() => handleSort('Category')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Category
                                                {sortOrder === 'Category' && (
                                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                                )}
                                            </a>
                                        </th>
                                        <th>Description</th>
                                        <th>
                                            <a
                                                role="button"
                                                onClick={() => handleSort('Calories')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Calories (kcal)
                                                {sortOrder === 'Calories' && (
                                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                                )}
                                            </a>
                                        </th>
                                        <th>
                                            <a
                                                role="button"
                                                onClick={() => handleSort('Protein')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Protein (g)
                                                {sortOrder === 'Protein' && (
                                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                                )}
                                            </a>
                                        </th>
                                        <th>
                                            <a
                                                role="button"
                                                onClick={() => handleSort('Fat')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Fat (g)
                                                {sortOrder === 'Fat' && (
                                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                                )}
                                            </a>
                                        </th>
                                        <th>
                                            <a
                                                role="button"
                                                onClick={() => handleSort('Carbohydrates')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Carbohydrates (g)
                                                {sortOrder === 'Carbohydrates' && (
                                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                                )}
                                            </a>
                                        </th>
                                        {true /* Replace with condition based on user role */ && (
                                            <th>Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/products/details/${product.id}`}>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{product.description}</td>
                                            <td>{product.calories}</td>
                                            <td>{product.protein}</td>
                                            <td>{product.fat}</td>
                                            <td>{product.carbohydrates}</td>
                                            {true /* Replace with condition based on user role */ && (
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent row click
                                                            deleteProduct(product.id);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </>
                )}
            </div>
        </Container>
    );
};

export default MyProducts;
