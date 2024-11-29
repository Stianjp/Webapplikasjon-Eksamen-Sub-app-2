import React, { useState, useEffect } from "react";
import { Container, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Tabell from '../shared/Tabell';

const API_BASE_URL = 'http://localhost:7067';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProducer, setIsProducer] = useState(false);
    
    const navigate = useNavigate();
   
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/Products`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
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

    // Fetch user data and set roles
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/Users/current`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error('Failed to fetch user data');

            const userData = await response.json();
            setUser(userData);
            setIsAdmin(userData.roles?.includes('Administrator') || false);
            setIsProducer(userData.roles?.includes('FoodProducer') || false);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            await fetchUserData();
            await fetchProducts();
        };
        initializePage();
    }, []);

    // Handle product deletion success
    const handleProductUpdated = () => {
        fetchProducts();
    };

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get user-specific products if user is a producer
    const userProducts = isProducer 
        ? filteredProducts.filter(product => product.producerId === user?.id)
        : filteredProducts;

    // Display all products if admin, otherwise show user-specific products for producers
    const displayedProducts = isAdmin ? filteredProducts : userProducts;

    return (
        <Container>
            <div className="AllProducts">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Products</h1>
                    {(isAdmin || isProducer) && (
                        <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/products/add')}
                        >
                            Add New Product
                        </button>
                    )}
                </div>
                
                <Form.Group className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Search products by name or description"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="mb-3"
                    />
                </Form.Group>

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
                                isAdmin={isAdmin}
                                isProducer={isProducer}
                                currentUserId={user?.id}
                                onProductUpdated={handleProductUpdated}
                            />
                        )}
                    </>
                )}
            </div>
        </Container>
    );
};

export default ProductPage;