import React from 'react';
import { Button, Table } from 'react-bootstrap';

const ProductsTable = ({ products, onEditProduct, onDeleteProduct, canEditProduct }) => {
  return (
    <Table striped bordered hover responsive>
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
          <th>Actions</th>
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
            <td>
              {canEditProduct(product) && (
                <>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEditProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDeleteProduct(product)}
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
  );
};

export default ProductsTable;