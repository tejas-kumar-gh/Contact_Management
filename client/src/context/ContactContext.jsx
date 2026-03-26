import { createContext, useState, useCallback } from 'react';
import api from '../services/api';

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.favorite) params.append('favorite', 'true');
      if (filters.sort) params.append('sort', filters.sort);

      const { data } = await api.get(`/contacts?${params.toString()}`);
      setContacts(data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/contacts/stats/dashboard');
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }, []);

  const getContact = async (id) => {
    try {
      const { data } = await api.get(`/contacts/${id}`);
      return data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Contact not found');
      return null;
    }
  };

  const addContact = async (contactData) => {
    try {
      const { data } = await api.post('/contacts/', contactData);
      setContacts([data.data, ...contacts]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add contact');
      return false;
    }
  };

  const updateContact = async (id, contactData) => {
    try {
      const { data } = await api.put(`/contacts/${id}`, contactData);
      setContacts(contacts.map(c => c._id === id ? data.data : c));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contact');
      return false;
    }
  };

  const deleteContact = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      setContacts(contacts.filter(c => c._id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contact');
      return false;
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const { data } = await api.put(`/contacts/${id}/favorite`);
      setContacts(contacts.map(c => c._id === id ? data.data : c));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update favorite status');
      return false;
    }
  };

  const bulkDelete = async (ids) => {
    try {
      await api.post('/contacts/bulk-delete', { contactIds: ids });
      setContacts(contacts.filter(c => !ids.includes(c._id)));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contacts');
      return false;
    }
  };

  return (
    <ContactContext.Provider 
      value={{ 
        contacts, stats, loading, error,
        fetchContacts, fetchStats, getContact, addContact, updateContact, deleteContact, toggleFavorite, bulkDelete
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};
