import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Shared/Sidebar';
import Home from './Home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
    <div className='App d-flex'>
      <Sidebar />
      <main className="flex-grow-1 p-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/my" element={<MyProducts />} />
            <Route path="/products/add" element={<CreateProduct />} />
            <Route path="/account" element={<Account />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        </div>
        </Router>
  );
}

export default App;
