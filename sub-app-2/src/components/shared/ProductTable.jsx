import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ProductTable = ({ 
    products, 
    showActions = false,
    onEdit = null,
    onDelete = null
}) => {
    return (
        <div className="table-responsive">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Categories</th>
                        <th>Calories</th>
                        <th>Protein</th>
                        <th>Fat</th>
                        <th>Carbs</th>
                        <th>Allergens</th>
                        {showActions && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.categoryList.join(', ')}</td>
                            <td>{product.calories}</td>
                            <td>{product.protein}</td>
                            <td>{product.fat}</td>
                            <td>{product.carbohydrates}</td>
                            <td>{product.allergens}</td>
                            {showActions && (
                                <td>
                                    <div className="d-flex gap-2">
                                        {onEdit && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => onEdit(product)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => onDelete(product)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ProductTable;