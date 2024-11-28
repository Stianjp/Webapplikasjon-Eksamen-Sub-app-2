import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import Tabell from '../shared/Tabell';


const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Dette bør komme fra din auth context/service
    const currentUserId = "123"; // Replace with actual logged-in user ID bør gjøres i backend?

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const fetchMyProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/itemapi/myitems/${currentUserId}`); // Baserer seg på at man har et eget endpoint i apien som gir brukeren egen produkter ut
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
    };

    useEffect(() => {
        fetchMyProducts();
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