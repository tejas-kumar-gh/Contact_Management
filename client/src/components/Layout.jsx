import { useState, useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FiHome, FiUsers, FiUserPlus, FiUser, FiLogOut, FiMenu, FiX 
} from 'react-icons/fi';
import { RiContactsBook3Line } from 'react-icons/ri';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/contacts', name: 'All Contacts', icon: <FiUsers size={20} /> },
    { path: '/contacts/add', name: 'Add Contact', icon: <FiUserPlus size={20} /> },
    { path: '/profile', name: 'Profile', icon: <FiUser size={20} /> },
  ];

  return (
    <div className="layout-wrapper">
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar ${sidebarOpen ? '' : 'closed-mobile'}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo-link">
            <RiContactsBook3Line size={24} />
            <span>Connectify</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="mobile-close-btn">
            <FiX size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span style={{ marginLeft: '12px' }}>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'User'}</p>
              <p className="user-email">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <header className="mobile-header">
          <button onClick={() => setSidebarOpen(true)} className="menu-btn">
            <FiMenu size={20} />
          </button>
          <Link to="/" className="logo-link" style={{ flex: 1, justifyContent: 'center' }}>
            <RiContactsBook3Line size={24} />
            <span>Connectify</span>
          </Link>
          <div style={{ width: 38 }}></div>
        </header>

        <main className="page-wrapper">
          <div style={{ maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
