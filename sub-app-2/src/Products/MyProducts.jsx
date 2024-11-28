import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import Tabell from '../shared/Tabell';
import { mockProducts, API_URL } from './mockDataProducts';

const MyProducts = () => {
    // Initialize with filtered mock data for current user
    const currentUserId = "123";
    const initialProducts = mockProducts.filter(p => p.producerId === currentUserId);
    
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const fetchMyProducts = async () => {
        // Comment out API fetch for now and use mock data
        /* 
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/itemapi/myitems/${currentUserId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch your products. Please try again later.');
        } finally {
            setLoading(false);
        }
        */
    };

    useEffect(() => {
        // Uncomment when ready to use real API
        // fetchMyProducts();
    }, []);

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
                        apiUrl={API_URL}
                        isAdmin={false}
                        isProducer={true}
                        currentUserId={currentUserId}
                    />
                )}
            </div>
        </Container>
    );
};

export default MyProducts;