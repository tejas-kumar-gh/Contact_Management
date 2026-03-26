import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiUser } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, error } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    const success = await updateProfile(name);
    setLoading(false);
    if (success) {
      setSuccessMsg('Profile updated successfully');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">Manage your account settings.</p>
        </div>
      </div>

      <div className="glass-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="alert-error">{error}</div>}
          {successMsg && <div className="alert-success">{successMsg}</div>}

          <div>
            <label className="glass-label">Display Name</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <FiUser style={{ position: 'absolute', left: 14, color: 'var(--text-muted)' }} size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: 40 }}
              />
            </div>
            <p className="input-hint">This is the name that will be displayed on your dashboard.</p>
          </div>

          <div>
            <label className="glass-label">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="glass-input"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
            />
            <p className="input-hint">Your email address cannot be changed.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(171, 78, 104, 0.1)' }}>
            <button
              type="submit"
              disabled={loading || name === user?.name}
              className="btn btn-primary"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
