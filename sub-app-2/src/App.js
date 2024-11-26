import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavMenu from './shared/Navbar';
import Home from './Home/Home';
import ProductsPage from './Products/ProductPage';
import MyProducts from './Products/MyProducts';
import CreateProduct from './Products/CreateProduct';
import Account from './Home/Account';
import Privacy from './Home/Privacy';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
  return (
    <Router>
    <div className='d-flex'>
      <NavMenu />
      <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Products/ProductPage" element={<ProductsPage />} />
            <Route path="/Products/my" element={<MyProducts />} />
            <Route path="/Products/add" element={<CreateProduct />} />
            <Route path="/account" element={<Account />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        </div>
        </Router>
  );
}

export default App;
