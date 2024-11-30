const AppRoutes = () => {
    return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/account" element={<Account />} />
  
        {/* Product Routes with Role-based Access */}
        <Route path="/products" element={
          <PrivateRoute allowedRoles={['Administrator', 'FoodProducer', 'RegularUser']}>
            <ProductPage />
          </PrivateRoute>
        } />
  
        {/* Routes for Admin and FoodProducer */}
        <Route path="/products/my" element={
          <PrivateRoute allowedRoles={['Administrator', 'FoodProducer']}>
            <MyProducts />
          </PrivateRoute>
        } />
  
        <Route path="/products/add" element={
          <PrivateRoute allowedRoles={['Administrator', 'FoodProducer']}>
            <CreateProduct />
          </PrivateRoute>
        } />
      </Routes>
    );
  };