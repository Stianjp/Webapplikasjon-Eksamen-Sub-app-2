// MyProducts.jsx
import React, { useState, useEffect } from 'react';
import { Container, Form, Alert, Button, Table, Badge } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import EditProductModal from '../../components/shared/EditProductModal';
import DeleteProductModal from '../../components/shared/DeleteProductModal';

const API_BASE_URL = 'http://localhost:7067';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setEditedProduct] = useState({
    id: '',
    name: '',
    description: '',
    categoryList: [],
    calories: '',
    protein: '',
    fat: '',
    carbohydrates: '',
    allergens: '',
    producerId: ''
  });

  const getUserInfo = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        let userRoles = decodedToken['role'] || decodedToken['roles'];
        if (!Array.isArray(userRoles)) {
          userRoles = [userRoles];
        }
        setRoles(userRoles);
        setUserId(decodedToken['sub'] || decodedToken['nameidentifier']);
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Error getting user information');
      }
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You are not logged in. Please log in to view products.');
        setLoading(false);
        return;
      }

      // Use the correct endpoints based on role
      const productsEndpoint = roles.includes('Administrator')
        ? `${API_BASE_URL}/api/Products/GetAllProducts`
        : `${API_BASE_URL}/api/Products/user-products`;

      const productsResponse = await fetch(productsEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      // Fetch categories using the dedicated endpoint
      const categoriesResponse = await fetch(`${API_BASE_URL}/api/Products/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (productsResponse.status === 401 || categoriesResponse.status === 401) {
        setError('Your session has expired. Please log in again.');
        return;
      }

      if (!productsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      fetchProducts();
    }
  }, [selectedCategory, roles]);

  const canEditProduct = (product) => {
    return roles.includes('Administrator') || 
           (roles.includes('FoodProducer') && product.producerId === userId);
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
    if (!canEditProduct(selectedProduct)) {
      setError('You do not have permission to edit this product.');
      return;
    }

    const formattedData = {
      ...formData,
      id: parseInt(formData.id),
      calories: parseFloat(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      fat: parseFloat(formData.fat) || 0,
      carbohydrates: parseFloat(formData.carbohydrates) || 0,
      categoryList: Array.isArray(formData.categoryList) ? formData.categoryList : []
    };

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/Products/UpdateProduct${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Failed to update product');
      }

      await fetchProducts();
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message || 'Failed to update product');
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
    if (!canEditProduct(selectedProduct)) {
      setError('You do not have permission to delete this product.');
      return;
    }

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
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    setEditedProduct(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products
    .filter(product =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Container className="mt-4">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Products {roles.includes('Administrator') ? '(Admin View)' : ''}</h2>
          <Badge bg="info">{roles.join(', ')}</Badge>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Form.Group className="w-25">
            <Form.Control
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="w-25">
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
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
    {filteredProducts.map((product) => (
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

      <EditProductModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        product={formData}
        onChange={setEditedProduct}
        onSave={handleSaveEdit}
        categories={categories}
      />

      <DeleteProductModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirmation}
        productName={selectedProduct?.name}
      />
    </Container>
  );
};

export default MyProducts;