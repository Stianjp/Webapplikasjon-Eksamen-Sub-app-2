const PrivateRoute = ({ children, allowedRoles }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return <Navigate to="/login" />;
    }
  
    try {
      const decodedToken = jwtDecode(token);
      let userRoles = decodedToken['role'] || decodedToken['roles'];
      if (!Array.isArray(userRoles)) {
        userRoles = [userRoles];
      }
  
      const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));
      
      if (!hasAllowedRole) {
        return <Navigate to="/unauthorized" />;
      }
  
      return children;
    } catch (error) {
      localStorage.removeItem('authToken');
      return <Navigate to="/login" />;
    }
  };