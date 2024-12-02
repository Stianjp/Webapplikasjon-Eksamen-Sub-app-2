import React, { useState, useEffect } from "react";
import { Container, Form, Alert, Button, Table , Card} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';

const API_BASE_URL = 'http://localhost:7067';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);
    
    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log('No auth token found');
                navigate('/login');
                return;
            }

            const decodedToken = jwtDecode(token);
            let userRoles = decodedToken['role'] || decodedToken['roles'];
            if (!Array.isArray(userRoles)) {
                userRoles = [userRoles];
            }

            setUser({
                id: decodedToken['sub'] || '',
                name: decodedToken['name'] || ''
            });
            setRoles(userRoles);

        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(
                `${API_BASE_URL}/api/Products/GetAllProducts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Products/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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

    useEffect(() => {
        const initializePage = async () => {
            await Promise.all([
                fetchUserData(),
                fetchProducts(),
                fetchCategories()
            ]);
        };
        initializePage();
    }, [selectedCategory]);

    const handleRowClick = (productId, event) => {
        if (event.target.tagName.toLowerCase() === 'button' || 
            event.target.closest('button')) {
            return;
        }
        navigate(`/product-details/${productId}`);
    };

    const canEditProduct = (product) => {
        return roles.includes('Administrator') || 
               (roles.includes('FoodProducer') && product.producerId === user?.id);
    };

    const handleEditProduct = (product) => {
        if (!canEditProduct(product)) {
            setError('You do not have permission to edit this product.');
            return;
        }
        
        setSelectedProduct(product);
        setEditedProduct({
            ...product,
            categoryList: Array.isArray(product.categoryList) ? product.categoryList : []
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Products/UpdateProduct${selectedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(editedProduct)
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            await fetchProducts();
            setShowEditModal(false);
            setSelectedProduct(null);
            setEditedProduct(null);

        } catch (error) {
            console.error('Error updating product:', error);
            setError('Failed to update product. Please try again.');
        }
    };

    const handleDeleteProduct = (product) => {
        if (!canEditProduct(product)) {
            setError('You do not have permission to delete this product.');
            return;
        }
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Products/DeleteProduct${selectedProduct.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            await fetchProducts();
            setShowDeleteModal(false);
            setSelectedProduct(null);

        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product. Please try again.');
        }
    };

    const filteredProducts = products.filter(product =>
        (selectedCategory === '' || product.categoryList.includes(selectedCategory)) &&
        (product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         product.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Container>
            <Card>
                <Card.Body>
            <div className="section-container">
                <div className="d-flex justify-content-between align-items-center">
                    <h1>Products</h1>
                    <div className="d-flex align-items-center">
                        {(roles.includes('Administrator') || roles.includes('FoodProducer')) && (
                            <Button
                                variant="primary"
                                onClick={() => navigate('/products/add')}
                                className="me-3"
                            >
                                Add new product
                            </Button>
                        )}
                        <span className="badge bg-warning text-dark">
                            {filteredProducts.length} Products
                        </span>
                    </div>
                </div>

                <p className="info mt-3">
                    Welcome to the product catalog. Each product displays essential information including 
                    nutritional content (calories, protein, fat, and carbohydrates), categorization, 
                    and allergen details.
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
                            onChange={(e) => setSelectedCategory(e.target.value)}
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
                    </Form>
                </div>

                {/* Search Bar */}
                <div className="search-container mt-3">
                    <Form.Control
                        type="text"
                        placeholder="Search for a product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="tag-info mt-3">
                    <p>The nutritional values below are based on 100 grams of the product</p>
                </div>

                <hr />

                {error && (
                    <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <div className="text-center p-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {filteredProducts.length === 0 ? (
                            <Alert variant="info">
                                No products found.
                                {searchQuery && " Try adjusting your search criteria."}
                            </Alert>
                        ) : (
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Categories</th>
                                        <th>Calories</th>
                                        <th>Protein (g)</th>
                                        <th>Fat (g)</th>
                                        <th>Carbs (g)</th>
                                        <th>Allergens</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id}
                                        onClick={(e) => handleRowClick(product.id, e)}>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>{product.categoryList.join(', ')}</td>
                                            <td>{product.calories}</td>
                                            <td>{product.protein}</td>
                                            <td>{product.fat}</td>
                                            <td>{product.carbohydrates}</td>
                                            <td>{product.allergens || 'None'}</td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                {canEditProduct(product) && (
                                                    <>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleEditProduct(product)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteProduct(product)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </>
                )}
            </div>

                </Card.Body>
            </Card>

            <EditProductModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                product={editedProduct}
                onChange={setEditedProduct}
                onSave={handleSaveEdit}
                categories={categories}
            />

            <DeleteProductModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirmation}
                product={selectedProduct}
            />
        </Container>
    );
};

export default ProductPage;