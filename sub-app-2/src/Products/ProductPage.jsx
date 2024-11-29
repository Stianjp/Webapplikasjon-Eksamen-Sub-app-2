import React, { useState, useEffect } from "react";
import { Container, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Tabell from '../shared/Tabell';

const API_BASE_URL = 'http://localhost:7067/api';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const navigate = useNavigate();
   
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/Products`);

            if (!response.ok) {
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

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleProductUpdated = () => {
        fetchProducts();
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container>
            <div className="AllProducts">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Products</h1>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/products/add')}
                    >
                        Add New Product
                    </button>
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
                        {filteredProducts.length === 0 ? (
                            <Alert variant="info">
                                No products found.
                                {searchQuery && " Try adjusting your search criteria."}
                            </Alert>
                        ) : (
                            <Tabell 
                                products={filteredProducts}
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