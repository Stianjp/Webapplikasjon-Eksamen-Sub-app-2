const Layout = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState([]);
  
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        setRoles(Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role]);
      }
    }, []);
  
    const handleLogout = () => {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setRoles([]);
    };
  
    return (
      <div className="app">
        <Sidebar 
          isAuthenticated={isAuthenticated}
          roles={roles}
          onLogout={handleLogout}
        />
        <main className="main-content">
          {children}
        </main>
      </div>
    );
  };