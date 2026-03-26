import { useEffect, useContext, useState } from 'react';
import { ContactContext } from '../context/ContactContext';
import { Link } from 'react-router-dom';
import { FiSearch, FiGrid, FiList, FiPlus, FiStar, FiUsers } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import './ContactList.css';

const ContactCard = ({ contact, onToggleFavorite, onSelect, selected }) => (
  <div className={`glass-card contact-card ${selected ? 'selected' : ''}`}>
    <div className="card-header">
      <div className="card-title-area">
        <input 
          type="checkbox" 
          checked={selected}
          onChange={() => onSelect(contact._id)}
          className="checkbox-custom"
        />
        <div className="contact-avatar">
          {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
        </div>
        <div style={{ minWidth: 0 }}>
          <Link to={`/contacts/${contact._id}`} style={{ textDecoration: 'none' }}>
            <h3 className="contact-name" style={{ color: 'var(--rose-vale-dark)' }}>{contact.firstName} {contact.lastName}</h3>
          </Link>
          <p className="contact-email" style={{ margin: 0 }}>{contact.jobTitle || 'No Title'}</p>
        </div>
      </div>
      <button 
        onClick={() => onToggleFavorite(contact._id)}
        className={`fav-btn ${contact.isFavorite ? 'active' : ''}`}
      >
        <FiStar style={contact.isFavorite ? {fill: 'currentColor'} : {}} size={20} />
      </button>
    </div>
    
    <div className="contact-info">
      <p><span className="info-label">Email:</span> {contact.email}</p>
      <p><span className="info-label">Phone:</span> {contact.phone}</p>
    </div>
  </div>
);

const ContactListItem = ({ contact, onToggleFavorite, onSelect, selected }) => (
  <div className={`list-item ${selected ? 'selected' : ''}`}>
    <div className="card-title-area" style={{ flex: 1 }}>
      <input 
        type="checkbox" 
        checked={selected}
        onChange={() => onSelect(contact._id)}
        className="checkbox-custom"
      />
      <div className="contact-avatar" style={{ width: 40, height: 40, fontSize: '1rem' }}>
         {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
      </div>
      <div className="list-content">
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
           <Link to={`/contacts/${contact._id}`} style={{ textDecoration: 'none', color: 'var(--rose-vale-dark)', fontWeight: '600' }}>
            {contact.firstName} {contact.lastName}
          </Link>
        </div>
        <div className="contact-email" style={{ display: 'flex' }}>{contact.email}</div>
        <div className="contact-email" style={{ display: 'flex' }}>{contact.phone}</div>
      </div>
    </div>
    <div style={{ marginLeft: '16px' }}>
       <button 
        onClick={() => onToggleFavorite(contact._id)}
        className={`fav-btn ${contact.isFavorite ? 'active' : ''}`}
      >
        <FiStar style={contact.isFavorite ? {fill: 'currentColor'} : {}} size={20} />
      </button>
    </div>
  </div>
);

const ContactList = () => {
  const { contacts, fetchContacts, loading, toggleFavorite, bulkDelete } = useContext(ContactContext);
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);
  
  useEffect(() => {
    fetchContacts({ search: searchTerm, favorite: filterFavorite, sort: sortOrder });
  }, [fetchContacts, searchTerm, filterFavorite, sortOrder]);

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(contacts.map(c => c._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} contacts?`)) {
      const success = await bulkDelete(selectedIds);
      if (success) {
        setSelectedIds([]);
      }
    }
  };

  return (
    <div>
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title">All Contacts</h1>
          <p className="page-subtitle">Manage and organize your network.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {selectedIds.length > 0 && (
             <button onClick={handleDeleteSelected} className="btn btn-danger">
              <RiDeleteBinLine /> Delete ({selectedIds.length})
            </button>
          )}
          <Link to="/contacts/add" className="btn btn-primary">
            <FiPlus /> Add Contact
          </Link>
        </div>
      </div>

      <div className="glass-container" style={{ padding: '16px', marginBottom: '24px' }}>
        <div className="contact-toolbar">
          <div className="search-wrapper">
            <FiSearch className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button
              onClick={() => setFilterFavorite(!filterFavorite)}
              className={`filter-btn ${filterFavorite ? 'active' : ''}`}
            >
              <FiStar style={filterFavorite ? {fill: 'currentColor'} : {}} /> 
              Favorites
            </button>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="nameA-Z">Name A-Z</option>
              <option value="nameZ-A">Name Z-A</option>
            </select>

            <div className="view-toggle">
              <button
                onClick={() => setView('grid')}
                className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`view-btn ${view === 'list' ? 'active' : ''}`}
              >
                <FiList size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {contacts.length > 0 && (
        <div className="select-all-bar">
           <input 
            type="checkbox" 
            checked={selectedIds.length === contacts.length && contacts.length > 0}
            onChange={handleSelectAll}
            className="checkbox-custom"
          />
          <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Select All</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="glass-container empty-state">
          <FiUsers className="empty-icon" />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: 'var(--text-dark)' }}>No contacts found</h3>
          <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)' }}>Get started by configuring your list.</p>
          <Link to="/contacts/add" className="btn btn-primary">
            <FiPlus /> New Contact
          </Link>
        </div>
      ) : view === 'grid' ? (
        <div className="contacts-grid">
          {contacts.map(contact => (
            <ContactCard 
              key={contact._id} 
              contact={contact} 
              onToggleFavorite={toggleFavorite}
              onSelect={handleSelect}
              selected={selectedIds.includes(contact._id)}
            />
          ))}
        </div>
      ) : (
        <div className="contacts-list">
          {contacts.map(contact => (
            <ContactListItem 
              key={contact._id} 
              contact={contact} 
              onToggleFavorite={toggleFavorite}
              onSelect={handleSelect}
              selected={selectedIds.includes(contact._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
