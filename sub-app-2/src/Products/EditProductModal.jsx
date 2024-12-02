import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AVAILABLE_ALLERGENS = [
  "Milk", "Egg", "Peanut", "Soy", "Wheat", "Tree Nut", "Shellfish", "Fish", "Sesame", "None"
];

const EditProductModal = ({ 
  // methods used in the different componetns used for showing the modal and its functions
  show, onHide, product, onChange, onSave, categories }) => {
  const [validationErrors, setValidationErrors] = useState({});

  // Handes the input changes , runs when input is changed
  const handleInputChange = (e) => {

    // This gest info from the input form 
    const { name, value, type } = e.target;

    //Clearing previus erros 
    setValidationErrors(prev => ({ 
      ...prev, 
      [name]: undefined 
    }));
    
    // We start with the input valuer
    let processedValue = value;
    // Check for special inputs and handling of this
    if (type === 'number') {
      processedValue = value === '' ? 0 : parseFloat(value);
      //Use 0 if not a calid number 
      if (isNaN(processedValue)) processedValue = 0;
    }
    
    // Updates the product object with new value uses chaning
    onChange(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };


  // Handels allregens changes
  // Uses split method, map ,trim and push, this to the object of allergens or the list
  const handleAllergenChange = (allergen) => {
    onChange(prev => {
      let currentAllergens = prev.allergens ? prev.allergens.split(',').map(a => a.trim()) : [];
      
      if (allergen === 'None') {
        // If 'None' is selected, this clear all other allergens
        return {
          ...prev,
          allergens: 'None'
        };
      } else {
        // If any other allergen is selected it removse 'None' allergen check
        currentAllergens = currentAllergens.filter(a => a !== 'None');
        
        if (currentAllergens.includes(allergen)) {
          currentAllergens = currentAllergens.filter(a => a !== allergen);
        } else {
          currentAllergens.push(allergen);
        }

        return {
          ...prev,
          allergens: currentAllergens.join(', ')
        };
      }
    });
  };

  // Handles category changes in the form
  // Uses chaining for the object se raport for more info
  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(
      e.target.selectedOptions, 
      option => option.value);

    // Clears any previus validation erros from categories
    setValidationErrors(prev => ({ 
      ...prev, 
      categoryList: undefined 
    }));

    // Updates the product with new categories
    onChange(prev => ({
      ...prev,
      categoryList: selectedCategories
    }));
  };

  //Metode for validating the form and object
  // Se report for the compactform 
  // Uses trim method 
  const validateForm = () => {
    const errors = {};
    if (!product?.name?.trim()) errors.name = 'Name is required';
    if (!product?.description?.trim()) errors.description = 'Description is required';
    if (!product?.categoryList?.length) errors.categoryList = 'At least one category is required';
    if (product?.calories === undefined || product?.calories < 0) errors.calories = 'Valid calories value is required';
    if (product?.protein === undefined || product?.protein < 0) errors.protein = 'Valid protein value is required';
    if (product?.fat === undefined || product?.fat < 0) errors.fat = 'Valid fat value is required';
    if (product?.carbohydrates === undefined || product?.carbohydrates < 0) errors.carbohydrates = 'Valid carbohydrates value is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };

  //Checks if product exist, and if it has allergens property, 
  //then splits the string with comma and uses map method and trim to go tro the list, and remove spaces
  // No allergens returns a empty list
  // Commpacted formed with som help se report
  const currentAllergens = product?.allergens ? product.allergens.split(',').map(a => a.trim()) : [];

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{product?.id ? 'Edit Product' : 'Create Product'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Name*</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={product?.name || ''}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.name}
              required
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description*</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={product?.description || ''}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.description}
              required
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categories*</Form.Label>
            <Form.Select 
              multiple
              name="categoryList"
              value={product?.categoryList || []}
              onChange={handleCategoryChange}
              isInvalid={!!validationErrors.categoryList}
              required
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Hold Ctrl/Cmd to select multiple categories
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {validationErrors.categoryList}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Calories*</Form.Label>
                <Form.Control
                  type="number"
                  name="calories"
                  value={product?.calories ?? 0}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  isInvalid={!!validationErrors.calories}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.calories}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Protein (g)*</Form.Label>
                <Form.Control
                  type="number"
                  name="protein"
                  value={product?.protein ?? 0}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  isInvalid={!!validationErrors.protein}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.protein}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fat (g)*</Form.Label>
                <Form.Control
                  type="number"
                  name="fat"
                  value={product?.fat ?? 0}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  isInvalid={!!validationErrors.fat}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.fat}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Carbohydrates (g)*</Form.Label>
                <Form.Control
                  type="number"
                  name="carbohydrates"
                  value={product?.carbohydrates ?? 0}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  isInvalid={!!validationErrors.carbohydrates}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.carbohydrates}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Allergens</Form.Label>
            <Row className="mt-2">
              {AVAILABLE_ALLERGENS.map((allergen) => (
                <Col key={allergen} xs={12} sm={6} md={4}>
                  <Form.Check
                    type="checkbox"
                    id={`allergen-${allergen}`}
                    label={allergen}
                    checked={currentAllergens.includes(allergen)}
                    onChange={() => handleAllergenChange(allergen)}
                    disabled={allergen !== 'None' && currentAllergens.includes('None')}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;