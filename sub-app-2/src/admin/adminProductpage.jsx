import React, { useState, useEffect } from 'react';
import { Container, Form, Alert, Button, Table, Badge } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import EditProductModal from '../components/EditProductModal';
import DeleteProductModal from '../components/DeleteProductModal';
import ProductsTable from '../components/ProductTable';

const API_BASE_URL = 'http://localhost:7067';

const AdminProductspage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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

      const productsEndpoint = `${API_BASE_URL}/api/Products/GetAllProducts`;

      const productsResponse = await fetch(productsEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

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
    fetchProducts();
  }, [selectedCategory]);

  const canEditProduct = (product) => {
    return true; // Admin can edit all products
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditedProduct({
      ...product,
      categoryList: Array.isArray(product.categoryList) ? product.categoryList : []
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
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
          <h2>Products (Admin View)</h2>
          <Badge bg="info">Administrator</Badge>
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
        <ProductsTable 
        products={filteredProducts}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        canEditProduct={canEditProduct}
        />
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

export default AdminProductspage;