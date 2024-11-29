import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../shared/ProductForm';

const API_BASE_URL = 'http://localhost:7067/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryList: [],
    calories: '',
    protein: '',
    fat: '',
    carbohydrates: '',
    selectedAllergens: [],
    producerId: ''
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/Products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch product');

      const data = await response.json();
      setFormData({
        ...data,
        categoryList: Array.isArray(data.categoryList) ? data.categoryList : [],
        selectedAllergens: data.selectedAllergens || []
      });
    } catch (error) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/Products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          ...formData,
          calories: parseFloat(formData.calories),
          protein: parseFloat(formData.protein),
          fat: parseFloat(formData.fat),
          carbohydrates: parseFloat(formData.carbohydrates)
        })
      });

      if (!response.ok) throw new Error('Failed to update product');

      setSuccess(true);
      setTimeout(() => navigate('/products'), 1500);
    } catch (error) {
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <ProductForm
        isEdit={true}
        formData={formData}
        loading={loading}
        error={error}
        success={success}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/products/my')}
      />
    </Container>
  );
};

export default EditProduct;