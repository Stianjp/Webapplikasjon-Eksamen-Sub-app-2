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

{/* Need if sentens to routing so admin gets to admin components, and foodproducer gets to there components */}

function App() {
  return (
    <Router>
    <div className='App d-flex'>
      <Sidebar />
      <main className="flex-grow-1 p-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/my" element={<MyProducts />} />
            <Route path="/products/add" element={<CreateProduct />} />
            <Route path="/product-details/:id" element={<ProductDetails />} /> {/* id means its based on userRole, will show you buttons to edit or delet product like in sub-app-1*/}
            <Route path="/edit-product/:id" element={<CreateProduct />} /> {/* We gona reuse CreateProduct for editing no need for new component, still need to make the logic for it */}
            <Route path="/delete-product/:id" element={<DeleteProduct />} /> {/*Needs to create a new ProductDelet component*/}
            <Route path="/account" element={<Account />} />
            <Route path='/admin/users' element={<AdminUsers />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
      </main>
    </div>
    </Router>
  );
}

export default App;
