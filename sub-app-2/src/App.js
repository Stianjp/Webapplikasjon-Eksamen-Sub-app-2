import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './shared/Sidebar';
import Home from './Home/Home';
import ProductPage from './Products/ProductPage';
import MyProducts from './Products/MyProducts';
import CreateProduct from './Products/CreateProduct';
import DeleteProduct from './Products/DeleteProduct';
import ProductDetails from './Products/ProductDetails';
import Account from './Home/Account';
import Privacy from './Home/Privacy';
import AdminUsers from './admin/AdminUsers';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className='App d-flex'>
        <Sidebar />
        <main className="flex-grow-1 p-3">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Routes */}
            <Route path="/products" element={<ProductPage />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/account" element={<Account />} />

            {/* Producer Routes */}
            <Route path="/products/my" element={<MyProducts />} />
            <Route path="/products/add" element={<CreateProduct />} />
            <Route path="/edit-product/:id" element={<CreateProduct />} />
            <Route path="/delete-product/:id" element={<DeleteProduct />} />

            {/* Admin Routes */}
            <Route path="/admin/users" element={<AdminUsers />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
