import React, { useState } from "react";
import { Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7067/api';

const Tabell = ({ 
    products, 
    isAdmin = false,
    isProducer = false,
    currentUserId = null,
    onProductUpdated
}) => {
    const navigate = useNavigate();
    const [currentSort, setCurrentSort] = useState({ key: null, direction: 'asc' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'categoryList', label: 'Category' },
        { key: 'description', label: 'Description' },
        { key: 'calories', label: 'Calories' },
        { key: 'protein', label: 'Protein' },
        { key: 'fat', label: 'Fat' },
        { key: 'carbohydrates', label: 'Carbohydrates' }
    ];

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

    const handleEdit = (e, productId) => {
        e.stopPropagation();
        navigate(`/edit-product/${productId}`);
    };

    const handleDelete = async (e, productId) => {
        e.stopPropagation();
        setProductToDelete(productId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/Products/${productToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setShowDeleteModal(false);
            setProductToDelete(null);
            setDeleteError(null);
            onProductUpdated();
        } catch (error) {
            console.error('Error deleting product:', error);
            setDeleteError('Failed to delete product. Please try again.');
        }
    };

    const handleRowClick = (productId) => {
        navigate(`/product-details/${productId}`);
    };

    // No product found state
    if (!productId) {
        return (
            <Container className="py-4">
                <div>Product not found</div>
            </Container>
        );
    }

    return (
        <Container>
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
                            {(isAdmin || (isProducer && item.producerId === currentUserId)) && (
                                <td onClick={e => e.stopPropagation()}>
                                    <Button 
                                        variant="primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={(e) => handleEdit(e, item.id)}
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

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
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
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Tabell;