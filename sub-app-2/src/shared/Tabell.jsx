import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:7067';

const Tabell = ({ 
    products, 
    onProductUpdated,
    categories = []
}) => {
    const navigate = useNavigate();
    const [currentSort, setCurrentSort] = useState({ key: null, direction: 'asc' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProducer, setIsProducer] = useState(false);
    const [userId, setUserId] = useState(null);
    const [editedProduct, setEditedProduct] = useState({
        name: '',
        description: '',
        category: '',
        calories: '',
        protein: '',
        fat: '',
        carbohydrates: '',
    });

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'categoryList', label: 'Category' },
        { key: 'description', label: 'Description' },
        { key: 'calories', label: 'Calories' },
        { key: 'protein', label: 'Protein' },
        { key: 'fat', label: 'Fat' },
        { key: 'carbohydrates', label: 'Carbohydrates' }
    ];

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            try {
                const decodedToken = jwtDecode(authToken);
                let userRoles = decodedToken['role'] || decodedToken['roles'];
                if (!Array.isArray(userRoles)) {
                    userRoles = [userRoles];
                }
                setIsAdmin(userRoles.includes('Administrator'));
                setIsProducer(userRoles.includes('FoodProducer'));
                setUserId(decodedToken['sub'] || '');
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleSort = (key) => {
        const direction = 
            currentSort.key === key && currentSort.direction === 'asc' 
                ? 'desc' 
                : 'asc';
        setCurrentSort({ key, direction });
    };

    const renderSortIcon = (key) => {
        if (currentSort.key !== key) return null;
        return <span>{currentSort.direction === 'asc' ? '▲' : '▼'}</span>;
    };

    const handleEdit = (e, product) => {
        e.stopPropagation();
        setSelectedProduct(product);
        setEditedProduct({
            name: product.name,
            description: product.description,
            category: Array.isArray(product.categoryList) ? product.categoryList[0] : '',
            calories: product.calories,
            protein: product.protein,
            fat: product.fat,
            carbohydrates: product.carbohydrates,
        });
        setShowEditModal(true);
    };

    const handleDelete = (e, productId) => {
        e.stopPropagation();
        setProductToDelete(productId);
        setShowDeleteModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedProduct(null);
        setEditedProduct({
            name: '',
            description: '',
            category: '',
            calories: '',
            protein: '',
            fat: '',
            carbohydrates: '',
        });
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
        setDeleteError(null);
    };

    const handleSaveEdit = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Products/${selectedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(editedProduct),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            handleCloseEditModal();
            onProductUpdated(); // Refresh the product list
        } catch (error) {
            console.error('Error updating product:', error);
            // You might want to show an error message to the user here
        }
    };

    const confirmDelete = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Products/${productToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            handleCloseDeleteModal();
            onProductUpdated(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
            setDeleteError('Failed to delete product. Please try again.');
        }
    };

    const handleRowClick = (productId) => {
        navigate(`/product-details/${productId}`);
    };

    return (
        <>
            <Table className="table table-responsive table-hover">
                <thead>
                    <tr>
                        {columns.map(column => (
                            <th key={column.key} onClick={() => handleSort(column.key)}>
                                <div className="sort-header">
                                    {column.label}
                                    {renderSortIcon(column.key)}
                                </div>
                            </th>
                        ))}
                        {(isAdmin || isProducer) && <th>Actions</th>} 
                    </tr>
                </thead>
                <tbody>
                    {products && products.map(item => (
                        <tr 
                            key={item.id} 
                            onClick={() => handleRowClick(item.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{item.name}</td>
                            <td>{Array.isArray(item.categoryList) 
                                ? item.categoryList.join(', ') 
                                : 'No Categories'}
                            </td>
                            <td>{item.description}</td>
                            <td>{item.calories}</td>
                            <td>{item.protein}</td>
                            <td>{item.fat}</td>
                            <td>{item.carbohydrates}</td>
                            {(isAdmin || (isProducer && item.producerId === userId)) && (
                                <td onClick={e => e.stopPropagation()}>
                                    <Button 
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={(e) => handleEdit(e, item)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="danger"
                                        size="sm"
                                        onClick={(e) => handleDelete(e, item.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedProduct.name}
                                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedProduct.description}
                                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                value={editedProduct.category}
                                onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Calories (kcal)</Form.Label>
                            <Form.Control
                                type="number"
                                value={editedProduct.calories}
                                onChange={(e) => setEditedProduct({ ...editedProduct, calories: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Protein (g)</Form.Label>
                            <Form.Control
                                type="number"
                                value={editedProduct.protein}
                                onChange={(e) => setEditedProduct({ ...editedProduct, protein: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fat (g)</Form.Label>
                            <Form.Control
                                type="number"
                                value={editedProduct.fat}
                                onChange={(e) => setEditedProduct({ ...editedProduct, fat: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Carbohydrates (g)</Form.Label>
                            <Form.Control
                                type="number"
                                value={editedProduct.carbohydrates}
                                onChange={(e) => setEditedProduct({ ...editedProduct, carbohydrates: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Product Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this product?
                    {deleteError && (
                        <div className="text-danger mt-2">{deleteError}</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Tabell;