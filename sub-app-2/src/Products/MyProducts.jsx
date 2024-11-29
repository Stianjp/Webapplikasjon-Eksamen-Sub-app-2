import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import Tabell from '../shared/Tabell';

const API_BASE_URL = 'http://localhost:7067';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const fetchMyProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/Products/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch your products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleProductUpdated = () => {
        fetchMyProducts(); // Refresh the list when a product is updated
    };

    return (
        <Container>
            <div className="MyProducts">
                <h1>My Products</h1>
                
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search by name or description"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </Form.Group>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Tabell 
                        products={filteredProducts}
                        isAdmin={false}
                        isProducer={true}
                        onProductUpdated={handleProductUpdated}
                    />
                )}
            </div>
        </Container>
    );
};

export default MyProducts;
