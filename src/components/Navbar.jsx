import { Settings, Menu, Plus, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchUser } from '../hooks/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = fetchUser();

  console.log("Navbar - Current User:", user);

  const isCreateQuizPage = location.pathname === '/create-quiz';
  const isAdminPage = location.pathname === '/admin';

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
      <div className="container">

        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img width="90" src="/images/image.png" alt="QuizApp Logo" />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <Menu size={24} />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav align-items-center ms-auto">

            {/* Admin Portal (hide on /admin) */}
            {!isAdminPage && (
              <li className="nav-item me-3">
                <button
                  onClick={() => navigate('/admin')}
                  className="btn btn-outline-primary d-flex align-items-center px-3 py-2"
                >
                  <Settings size={18} className="me-2" />
                  Admin Portal
                </button>
              </li>
            )}

            {/* Back to Site (only on /admin) */}
            {isAdminPage && (
              <li className="nav-item me-3">
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-outline-primary px-3 py-2"
                >
                  ← Back to Site
                </button>
              </li>
            )}

            {/* Create Quiz (hide on create-quiz & admin) */}
            {!isCreateQuizPage && !isAdminPage && (
              <li className="nav-item me-3">
                <button
                  onClick={() => navigate('/create-quiz')}
                  className="btn btn-outline-primary d-flex align-items-center px-3 py-2"
                >
                  <Plus size={18} className="me-2" />
                  Create Quiz
                </button>
              </li>
            )}

            {/* AUTH LOGIC FIXED */}
            {!isAdminPage && (
              user ? (
                <>
                  {/* Logged-in user: Show Profile + Logout */}
                  <li className="nav-item me-3">
                    <span className="btn btn-outline-secondary px-3 py-2">
                      <User size={18} className="me-2" />
                      {user.firstName}
                    </span>
                  </li>

                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-danger px-3 py-2"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* Guest: Show Login + Signup */}
                  <li className="nav-item me-2">
                    <Link
                      to="/login"
                      className="btn btn-outline-primary d-flex align-items-center px-3 py-2"
                    >
                      <User size={18} className="me-2" /> Login
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to="/signup"
                      className="btn btn-outline-primary px-3 py-2"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )
            )}

          </ul>
        </div>

      </div>
    </nav>
  );
}
