import Index from './Home/Index';
import './App.css';
import Sidebar from './Shared/Sidebar';

function App() {
  return (
    <div className='App'>
      <Sidebar />
      <Index />
    </div>
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
