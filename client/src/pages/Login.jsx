import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { RiContactsBook3Line } from 'react-icons/ri';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <RiContactsBook3Line size={64} color="var(--rose-vale)" />
        <h2>Welcome to Connectify</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Or{' '}
          <Link to="/register" style={{ color: 'var(--rose-vale)', fontWeight: 'bold', textDecoration: 'none' }}>
            create a new account
          </Link>
        </p>
      </div>

      <div className="glass-container auth-box">
        {error && (
          <div style={{ backgroundColor: '#fff0f2', color: '#c82333', padding: '12px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #c82333' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="glass-label">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="glass-label">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
