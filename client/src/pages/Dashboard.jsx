import { useEffect, useContext } from 'react';
import { ContactContext } from '../context/ContactContext';
import { Link } from 'react-router-dom';
import { FiUsers, FiStar, FiClock, FiPlus } from 'react-icons/fi';
import './Dashboard.css';

const StatCard = ({ title, value, icon, variant }) => (
  <div className="glass-card stat-card">
    <div className="stat-info">
      <p className="stat-label">{title}</p>
      <p className="stat-value">{value !== undefined ? value : '-'}</p>
    </div>
    <div className={`stat-icon ${variant}`}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const { stats, fetchStats } = useContext(ContactContext);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Here's a summary of your contacts today.</p>
        </div>
        <Link to="/contacts/add" className="btn btn-primary">
          <FiPlus /> Add Contact
        </Link>
      </div>

      <div className="dashboard-grid">
        <StatCard 
          title="Total Contacts" 
          value={stats?.totalContacts} 
          icon={<FiUsers />} 
          variant="primary"
        />
        <StatCard 
          title="Favorite Contacts" 
          value={stats?.favoriteContacts} 
          icon={<FiStar style={{fill: 'currentColor'}} />} 
          variant="warning"
        />
        <StatCard 
          title="Added Last 7 Days" 
          value={stats?.recentContactsCount} 
          icon={<FiClock />} 
          variant="info"
        />
      </div>

      <div className="glass-container recent-contacts">
        <div className="recent-header">
          <h2>Recently Added</h2>
          <Link to="/contacts" className="recent-link">View all</Link>
        </div>
        <div className="recent-list">
          {stats?.recentContacts?.length > 0 ? (
            stats.recentContacts.map(contact => (
              <div key={contact._id} className="recent-item">
                <div className="contact-preview">
                  <div className="contact-avatar">
                    {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="contact-name">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <p className="contact-email">{contact.email}</p>
                  </div>
                </div>
                <div>
                  <Link to={`/contacts/${contact._id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
             <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>No contacts added recently.</p>
              <Link to="/contacts/add" className="recent-link" style={{ marginTop: '10px', display: 'inline-block' }}>
                Add your first contact
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
