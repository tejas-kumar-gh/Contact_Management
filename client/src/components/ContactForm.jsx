import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiAlignLeft } from 'react-icons/fi';
import './ContactForm.css';

const ContactForm = ({ initialData, onSubmit, isLoading, title }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    jobTitle: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-container">
      <div style={{ padding: '24px 30px', borderBottom: '1px solid rgba(171, 78, 104, 0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)' }}>{title}</h2>
      </div>
      <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
        <div className="form-grid">
          {/* First Name */}
          <div className="form-group">
            <label className="glass-label">First Name *</label>
            <div className="input-icon-wrapper">
              <FiUser className="input-icon" size={18} />
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="glass-input with-icon"
                placeholder="John"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label className="glass-label">Last Name *</label>
            <div className="input-icon-wrapper">
              <FiUser className="input-icon" size={18} />
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="glass-input with-icon"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="glass-label">Email *</label>
            <div className="input-icon-wrapper">
              <FiMail className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="glass-input with-icon"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="glass-label">Phone *</label>
            <div className="input-icon-wrapper">
              <FiPhone className="input-icon" size={18} />
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="glass-input with-icon"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          {/* Company */}
          <div className="form-group">
            <label className="glass-label">Company</label>
            <div className="input-icon-wrapper">
              <FiBriefcase className="input-icon" size={18} />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="glass-input with-icon"
                placeholder="Acme Inc"
              />
            </div>
          </div>

          {/* Job Title */}
          <div className="form-group">
            <label className="glass-label">Job Title</label>
            <div className="input-icon-wrapper">
              <FiBriefcase className="input-icon" size={18} />
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="glass-input with-icon"
                placeholder="Software Engineer"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="form-group" style={{ marginTop: '20px' }}>
          <label className="glass-label">Address</label>
          <div className="input-icon-wrapper" style={{ alignItems: 'flex-start' }}>
            <FiMapPin className="input-icon" size={18} style={{ top: '14px' }} />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="glass-input with-icon"
              placeholder="123 Main St, City, Country"
            ></textarea>
          </div>
        </div>

        {/* Notes */}
        <div className="form-group" style={{ marginTop: '20px' }}>
          <label className="glass-label">Notes</label>
          <div className="input-icon-wrapper" style={{ alignItems: 'flex-start' }}>
            <FiAlignLeft className="input-icon" size={18} style={{ top: '14px' }} />
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="glass-input with-icon"
              placeholder="Any additional notes..."
            ></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Saving...' : 'Save Contact'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
