import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Users, Plus, Trash2, Edit, Eye, Home, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard', exact: true },
    { path: '/admin/view', icon: Eye, label: 'View Quizzes' },
    { path: '/admin/add', icon: Plus, label: 'Add Quiz' },
    { path: '/admin/update', icon: Edit, label: 'Update Quiz' },
    { path: '/admin/delete', icon: Trash2, label: 'Delete Quiz' },
    {path: '/admin/users', icon: Users, label: 'Manage Users' }
  ];

  const isActive = (path, exact = false) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className={`col-lg-2 col-md-3 sidebar bg-dark text-white vh-100 position-fixed ${sidebarOpen ? 'show' : 'd-none d-md-block'}`}
             style={{ zIndex: 1000, width: '200px' }}>
          <div className="sidebar-sticky pt-3">
            <div className="text-center mb-4">
              <h4 className="text-warning">QuizWizzes Admin</h4>
              <hr className="text-white" />
            </div>
            
            <ul className="nav flex-column">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li className="nav-item" key={item.path}>
                    <Link
                      to={item.path}
                      className={`nav-link text-white d-flex align-items-center py-3 ${
                        isActive(item.path, item.exact) ? 'bg-primary rounded' : ''
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon size={18} className="me-3" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 p-3">
              <Link to="/" className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center">
                <ArrowLeft size={16} className="me-2" />
                Back to Site
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4" style={{ marginLeft: '250px' }}>
          {/* Mobile Header */}
          <div className="d-md-none py-3 bg-light border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-primary"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                ☰ Menu
              </button>
              <Link to="/" className="btn btn-outline-secondary">
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>

          {/* Nested routes render here */}
          <div className="py-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}