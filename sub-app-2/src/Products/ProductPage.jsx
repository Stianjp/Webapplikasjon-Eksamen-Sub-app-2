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

    const handleProductUpdated = () => {
        fetchProducts();
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
            <div className="justify-content-between">
                <h1>Products</h1>
                {(isAdmin || isProducer) && (
                    <a 
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/products/add')}
                    >
                        <img src={`${process.env.PUBLIC_URL}/icons/plus-solid.svg`} alt="add new product" className="icon" />
                        Add new product
                    </a>
                )}
            </div>

            <p className="info mt-3">
                Welcome to the product catalog. This page gives you a comprehensive view of all registered food products in our database. Each product displays essential information including nutritional content (calories, protein, fat, and carbohydrates), categorization, and allergen details. 
                Use the search function to find specific products, or click on any item for detailed information.
            </p>

            <div className="search-container mt-3">
                <div className="search d-flex justify-content-between align-items-center mt-3">
                    <Form.Control
                        type="text"
                        placeholder="Search for a product..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="form-control"
                    />
                    <button 
                        className="btn btn-primary btn-md ms-3"
                        onClick={() => fetchProducts()}
                    >
                        Search
                    </button>
                </div>
            </div>

            <hr />

            <div className="tag-info mt-3">
                <p>The nutritional values below are based on 100 grams of the product</p>
            </div>

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
