import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../shared/ProductForm';

const API_BASE_URL = 'http://localhost:7067/api';

const CreateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    selectedAllergens: []
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
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
        name: data.name || '',
        description: data.description || '',
        categoryList: data.categoryList || [],
        calories: data.calories || '',
        protein: data.protein || '',
        fat: data.fat || '',
        carbohydrates: data.carbohydrates || '',
        selectedAllergens: data.selectedAllergens || []
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const url = id ? `${API_BASE_URL}/api/Products/${id}` : `${API_BASE_URL}/api/Products`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          calories: parseFloat(formData.calories),
          protein: parseFloat(formData.protein),
          fat: parseFloat(formData.fat),
          carbohydrates: parseFloat(formData.carbohydrates)
        })
      });

      if (!response.ok) throw new Error('Failed to save product');

      setSuccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <ProductForm
        isEdit={!!id}
        formData={formData}
        loading={loading}
        error={error}
        success={success}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </Container>
  );
};

export default CreateProduct;