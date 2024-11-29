import React from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';

const ProductForm = ({ 
  isEdit,
  formData, 
  loading,
  error,
  success,
  allergenOptions = ['Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts', 'Peanuts', 'Wheat', 'Soy'],
  onSubmit,
  onChange,
  onCancel 
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const categories = e.target.value.split(',').map(cat => cat.trim());
    onChange({ ...formData, categoryList: categories });
  };

  const handleAllergenChange = (allergen) => {
    const selectedAllergens = formData.selectedAllergens || [];
    const newAllergens = selectedAllergens.includes(allergen)
      ? selectedAllergens.filter(a => a !== allergen)
      : [...selectedAllergens, allergen];
    onChange({ ...formData, selectedAllergens: newAllergens });
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>{isEdit ? 'Edit Product' : 'Create New Product'}</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">
          Product successfully {isEdit ? 'updated' : 'created'}! Redirecting...
        </Alert>}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categories (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              value={formData.categoryList.join(', ')}
              onChange={handleCategoryChange}
              placeholder="e.g., Dairy, Organic, Vegan"
            />
          </Form.Group>

          {['calories', 'protein', 'fat', 'carbohydrates'].map(field => (
            <Form.Group key={field} className="mb-3">
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)} (g)</Form.Label>
              <Form.Control
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Allergens</Form.Label>
            <Container fluid className="p-0">
              <Row xs={2} md={4}>
                {allergenOptions.map(allergen => (
                  <Col key={allergen} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`allergen-${allergen}`}
                      label={allergen}
                      checked={(formData.selectedAllergens || []).includes(allergen)}
                      onChange={() => handleAllergenChange(allergen)}
                    />
                  </Col>
                ))}
              </Row>
            </Container>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProductForm;