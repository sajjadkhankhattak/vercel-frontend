import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// List of admin email addresses (must match backend)
const ADMIN_EMAILS = [
  'stylishkhan760@gmail.com',   // Current user
  'admin@quizapp.com',          // Add your admin emails here
  'sajjadkhan@gmail.com' // Add more admin emails as needed
];

export default function AdminProtectedRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      setIsCheckingAdmin(true);
      
      // Check if user is authenticated
      if (!isAuthenticated() || !user) {
        console.log('🚫 Admin access denied: User not authenticated');
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      // Check if user email is in admin list
      const userIsAdmin = ADMIN_EMAILS.includes(user.email);
      
      if (userIsAdmin) {
        console.log(`✅ Admin access granted for: ${user.email}`);
        setIsAdmin(true);
      } else {
        console.log(`🚫 Admin access denied for: ${user.email} (not in admin list)`);
        setIsAdmin(false);
      }
      
      setIsCheckingAdmin(false);
    };

    checkAdminStatus();
  }, [user, isAuthenticated]);

  // Show loading while checking admin status
  if (isCheckingAdmin) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ message: "Please log in to access admin panel" }} replace />;
  }

  // If not admin, show access denied page
  if (!isAdmin) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-danger">
              <div className="card-header bg-danger text-white text-center">
                <h4 className="mb-0">🚫 Admin Access Required</h4>
              </div>
              <div className="card-body text-center">
                <div className="mb-4">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-danger">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V8h2v5z" fill="currentColor"/>
                  </svg>
                </div>
                <h5 className="card-title">Access Denied</h5>
                <p className="card-text text-muted">
                  You are logged in as: <strong>{user.email}</strong>
                  <br />
                  This area is restricted to authorized administrators only.
                </p>
                <p className="text-muted small">
                  If you believe this is an error, please contact your system administrator.
                </p>
                <div className="mt-4">
                  <button 
                    onClick={() => window.history.back()} 
                    className="btn btn-secondary me-2"
                  >
                    ← Go Back
                  </button>
                  <a href="/" className="btn btn-primary">
                    🏠 Home Page
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is admin, render the protected component
  return (
    <div>
      {/* Admin Status Indicator */}
      <div className="bg-success text-white py-1 px-3 small text-center">
        🛡️ Admin Access: {user.email} | Logged in as Administrator
      </div>
      {children}
    </div>
  );
}