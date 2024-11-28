import React from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

{/* Mangler api, kobling, servicelayer */ }

const CreateProduct = () =>{ 
    return(
        <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header>
                <h2 className="mb-0">Create Product</h2>
              </Card.Header>
              <Card.Body>
                {submitError && (
                  <Alert variant="danger">
                    {submitError}
                  </Alert>
                )}
  
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
  
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
  
                  <Form.Group className="mb-3">
                    <Form.Label>Categories</Form.Label>
                    <Form.Select
                      multiple
                      name="categoryList"
                      value={formData.categoryList}
                      onChange={handleCategoryChange}
                      isInvalid={!!errors.categoryList}
                    >
                      {categoryOptions.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.categoryList}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Hold Ctrl/Cmd to select multiple categories
                    </Form.Text>
                  </Form.Group>
  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Calories</Form.Label>
                        <Form.Control
                          type="number"
                          name="calories"
                          value={formData.calories}
                          onChange={handleNumberChange}
                          min="0"
                          step="0.1"
                          isInvalid={!!errors.calories}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.calories}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
  
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Protein (g)</Form.Label>
                        <Form.Control
                          type="number"
                          name="protein"
                          value={formData.protein}
                          onChange={handleNumberChange}
                          min="0"
                          step="0.1"
                          isInvalid={!!errors.protein}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.protein}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
  
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fat (g)</Form.Label>
                        <Form.Control
                          type="number"
                          name="fat"
                          value={formData.fat}
                          onChange={handleNumberChange}
                          min="0"
                          step="0.1"
                          isInvalid={!!errors.fat}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fat}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
  
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Carbohydrates (g)</Form.Label>
                        <Form.Control
                          type="number"
                          name="carbohydrates"
                          value={formData.carbohydrates}
                          onChange={handleNumberChange}
                          min="0"
                          step="0.1"
                          isInvalid={!!errors.carbohydrates}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.carbohydrates}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
  
                  <Form.Group className="mb-3">
                    <Form.Label>Allergens</Form.Label>
                    <Form.Select
                      multiple
                      name="selectedAllergens"
                      value={formData.selectedAllergens}
                      onChange={handleAllergenChange}
                    >
                      {allergenOptions.map(allergen => (
                        <option key={allergen} value={allergen}>{allergen}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Hold Ctrl/Cmd to select multiple allergens
                    </Form.Text>
                  </Form.Group>
  
                  <Button variant="primary" type="submit" className="w-100">
                    Create Product
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };
  

export default CreateProduct;