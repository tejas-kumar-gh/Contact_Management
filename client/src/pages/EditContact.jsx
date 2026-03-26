import { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContactContext } from '../context/ContactContext';
import ContactForm from '../components/ContactForm';

const EditContact = () => {
  const { getContact, updateContact } = useContext(ContactContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      const contact = await getContact(id);
      if (contact) {
        setInitialData(contact);
      } else {
        navigate('/contacts');
      }
    };
    fetchContact();
  }, [id, getContact, navigate]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    const success = await updateContact(id, formData);
    setLoading(false);
    if (success) {
      navigate(`/contacts/${id}`);
    }
  };

  if (!initialData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Edit Contact</h1>
          <p className="page-subtitle">Update the contact information.</p>
        </div>
      </div>
      <ContactForm 
        onSubmit={handleSubmit} 
        isLoading={loading} 
        initialData={initialData}
        title="Edit Contact Details" 
      />
    </div>
  );
};

export default EditContact;
