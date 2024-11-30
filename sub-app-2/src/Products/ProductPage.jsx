import React, { useState, useEffect } from "react";
import { Container, Form, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Tabell from '../shared/Tabell';

const API_BASE_URL = 'http://localhost:7067';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('Name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProducer, setIsProducer] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const initializePage = async () => {
            await Promise.all([
                fetchUserData(),
                fetchProducts(),
                fetchCategories()
            ]);
        };
        initializePage();
    }, [selectedCategory, sortOrder, sortDirection]);

    const fetchUserData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.log('No auth token found');
                navigate('/login');
                return;
            }

            const decodedToken = jwtDecode(authToken);
            let userRoles = decodedToken['role'] || decodedToken['roles'];
            if (!Array.isArray(userRoles)) {
                userRoles = [userRoles];
            }

            setUser({
                id: decodedToken['sub'] || '',
                name: decodedToken['name'] || ''
            });
            setIsAdmin(userRoles.includes('Administrator'));
            setIsProducer(userRoles.includes('FoodProducer'));

        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(
                `${API_BASE_URL}/api/Products?category=${selectedCategory}&sortOrder=${sortOrder}&sortDirection=${sortDirection}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Products/categories`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to fetch categories');

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleProductUpdated = () => {
        fetchProducts();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const clearCategoryFilter = () => {
        setSelectedCategory('');
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const userProducts = isProducer 
        ? filteredProducts.filter(product => product.producerId === user?.id)
        : filteredProducts;

    const displayedProducts = isAdmin ? filteredProducts : userProducts;

    return (
        <Container>
            <div className="section-container">
                <div className="d-flex justify-content-between align-items-center">
                    <h1>Products</h1>
                    <div className="d-flex align-items-center">
                        {(isAdmin || isProducer) && (
                            <Button
                                variant="primary"
                                onClick={() => navigate('/products/add')}
                                className="me-3"
                            >
                                Add new product
                            </Button>
                        )}
                        <span className="badge bg-warning">
                            {displayedProducts.length} Products
                        </span>
                    </div>
                </div>

                <p className="info mt-3">
                    Welcome to the product catalog. This page gives you a comprehensive view of all registered food products in our database. 
                    Each product displays essential information including nutritional content (calories, protein, fat, and carbohydrates), 
                    categorization, and allergen details. Use the search function to find specific products, or click on any item for detailed information.
                </p>

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
                            onClick={fetchProducts}
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

                {/* Search Bar */}
                <div className="search-container mt-3">
                    <Form.Control
                        type="text"
                        placeholder="Search for a product..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="tag-info mt-3">
                    <p>The nutritional values below are based on 100 grams of the product</p>
                </div>

                <hr />

                <div className="mt-3">
                    {error && (
                        <Alert variant="danger" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <div className="text-center p-4">
                            <p>Loading products...</p>
                        </div>
                    ) : (
                        <>
                            {displayedProducts.length === 0 ? (
                                <Alert variant="info">
                                    No products found.
                                    {searchQuery && " Try adjusting your search criteria."}
                                </Alert>
                            ) : (
                                <Tabell 
                                    products={displayedProducts}
                                    onProductUpdated={handleProductUpdated}
                                    categories={categories}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default ProductPage;