import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './Home/Index';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavMenu from './shared/Navbar';

function App() {
  return (
    <Router>
    <div className='App d-flex'>
      <NavMenu />
      <main className="flex-grow-1 p-3">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/my" element={<MyProducts />} />
            <Route path="/products/new" element={<CreateProduct />} />
            <Route path="/account" element={<Account />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        </div>
        </Router>
  );
}


// Temporary placeholder components
const Products = () => <h1>Products Page</h1>;
const MyProducts = () => <h1>My Products</h1>;
const CreateProduct = () => <h1>Create Product</h1>;
const Account = () => <h1>Account Page</h1>;
const Privacy = () => <h1>Privacy Page</h1>;
const Login = () => <h1>Login Page</h1>;


export default App;
