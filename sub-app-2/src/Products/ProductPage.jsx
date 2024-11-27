import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import { Tabell } from './shared/Tabell';

const API_URL = 'http://localhost:?'; // Replace with your actual URL

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Need to change this for authentication system
    const isAdmin = true; // Replace with actual admin check
    const isProducer = false; // Replace with actual producer check
    const currentUserId = "123"; // Replace with actual user ID

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/itemapi/itemlist`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error(`There was a problem with the fetch operation: ${error.message}`);
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return(
        <Container> 
            <div className="AllProducts">
                <h1>Products Page</h1>   
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
                        isAdmin={isAdmin}
                        isProducer={isProducer}
                        currentUserId={currentUserId}
                    />
                )}
            </div>
        </Container>
    );
};

export default ProductsPage;


