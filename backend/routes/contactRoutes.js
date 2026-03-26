const express = require('express');
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  toggleFavorite,
  getDashboardStats
} = require('../controllers/contactController');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.get('/stats/dashboard', getDashboardStats);
router.post('/bulk-delete', bulkDeleteContacts);
router.put('/:id/favorite', toggleFavorite);

router.route('/')
  .get(getContacts)
  .post(createContact);

router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;
