import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ContactContext } from '../context/ContactContext';
import { 
  FiMail, FiPhone, FiMapPin, FiBriefcase, FiEdit2, FiArrowLeft, FiStar
} from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import './ContactDetails.css';

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContact, deleteContact, toggleFavorite } = useContext(ContactContext);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      const data = await getContact(id);
      if (data) {
        setContact(data);
      } else {
        navigate('/contacts');
      }
      setLoading(false);
    };
    fetchContact();
  }, [id, getContact, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const success = await deleteContact(id);
      if (success) {
        navigate('/contacts');
      }
    }
  };

  const handleToggleFavorite = async () => {
    const success = await toggleFavorite(id);
    if (success) {
      setContact({ ...contact, isFavorite: !contact.isFavorite });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!contact) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
          style={{ padding: '8px 16px' }}
        >
          <FiArrowLeft /> Back
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link 
            to={`/contacts/${contact._id}/edit`}
            className="btn btn-secondary"
          >
            <FiEdit2 /> Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="btn btn-danger"
          >
            <RiDeleteBinLine /> Delete
          </button>
        </div>
      </div>

      <div className="glass-container">
        <div className="details-header">
          <button 
            onClick={handleToggleFavorite}
            className={`fav-btn-large ${contact.isFavorite ? 'active' : ''}`}
          >
            <FiStar size={24} style={contact.isFavorite ? {fill: 'currentColor'} : {}} />
          </button>
          
          <div className="details-avatar">
            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
          </div>
          <div className="details-title">
            <h1 className="details-name">
              {contact.firstName} {contact.lastName}
            </h1>
            <p className="details-job">{contact.jobTitle || 'No Job Title'}</p>
            {contact.company && (
              <div className="company-badge">
                <FiBriefcase />
                {contact.company}
              </div>
            )}
          </div>
        </div>

        <div className="details-body">
          <h3 className="details-section-title">Contact Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-item-label">
                <FiMail style={{color: 'var(--rose-vale)'}} /> Email
              </div>
              <p className="info-item-val">{contact.email}</p>
            </div>
            <div className="info-item">
              <div className="info-item-label">
                <FiPhone style={{color: 'var(--rose-vale)'}} /> Phone
              </div>
              <p className="info-item-val">{contact.phone}</p>
            </div>
            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
              <div className="info-item-label">
                <FiMapPin style={{color: 'var(--rose-vale)'}} /> Address
              </div>
              <p className="info-item-val">
                {contact.address ? (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{contact.address}</span>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No address provided</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="details-notes">
          <h3 className="details-section-title">Notes</h3>
          {contact.notes ? (
            <div className="notes-box">
              <p className="notes-text">{contact.notes}</p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No notes added.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
