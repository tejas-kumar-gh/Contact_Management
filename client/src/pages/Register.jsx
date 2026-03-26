import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { RiContactsBook3Line } from 'react-icons/ri';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    const success = await register(name, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <RiContactsBook3Line size={64} color="var(--rose-vale)" />
        <h2>Create an account</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Or{' '}
          <Link to="/login" style={{ color: 'var(--rose-vale)', fontWeight: 'bold', textDecoration: 'none' }}>
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="glass-container auth-box" style={{ padding: '30px 40px' }}>
        {(error || passwordError) && (
          <div style={{ backgroundColor: '#fff0f2', color: '#c82333', padding: '12px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #c82333' }}>
            {error || passwordError}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="glass-label">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={handleChange}
              className="glass-input"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="glass-label">Email address</label>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={handleChange}
              className="glass-input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="glass-label">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength="6"
              value={password}
              onChange={handleChange}
              className="glass-input"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label className="glass-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={handleChange}
              className="glass-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
