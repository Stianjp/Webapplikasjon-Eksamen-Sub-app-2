import React, { useState, useEffect } from 'react';
import { Container, Form, Alert, Button } from 'react-bootstrap';
import Tabell from '../shared/Tabell';

const API_BASE_URL = 'http://localhost:7067';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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

            // Fetch user products with category filter
            const response = await fetch(`${API_BASE_URL}/api/Products/user-products?category=${selectedCategory}`, {
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

    useEffect(() => {
        fetchMyProducts();
    }, [selectedCategory]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const clearCategoryFilter = () => {
        setSelectedCategory('');
    };

    const handleProductUpdated = () => {
        fetchMyProducts(); // Refresh the list when a product is updated
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
                            <Tabell
                                products={filteredProducts}
                                isAdmin={false}
                                isProducer={true}
                                onProductUpdated={handleProductUpdated}
                            />
                        )}
                    </>
                )}
            </div>
        </Container>
    );
};

export default MyProducts;
