import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContactContext } from '../context/ContactContext';
import ContactForm from '../components/ContactForm';

const AddContact = () => {
  const { addContact } = useContext(ContactContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    const success = await addContact(formData);
    setLoading(false);
    if (success) {
      navigate('/contacts');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Add New Contact</h1>
          <p className="page-subtitle">Fill in the information to add a new contact to your list.</p>
        </div>
      </div>
      <ContactForm onSubmit={handleSubmit} isLoading={loading} title="Contact Details" />
    </div>
  );
};

export default AddContact;
