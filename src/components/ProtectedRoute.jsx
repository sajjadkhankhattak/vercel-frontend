import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login page with return url
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;