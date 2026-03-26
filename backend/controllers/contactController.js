const Contact = require('../models/Contact');

// @desc    Get all contacts for logged in user (with search and filter)
// @route   GET /api/contacts
// @access  Private
exports.getContacts = async (req, res, next) => {
  try {
    const { search, favorite, sort } = req.query;

    let query = { user: req.user.id };

    // Search filter
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Favorite filter
    if (favorite === 'true') {
      query.isFavorite = true;
    }

    let queryBuilder = Contact.find(query);

    // Sorting
    if (sort) {
      switch (sort) {
        case 'nameA-Z':
          queryBuilder = queryBuilder.sort({ firstName: 1, lastName: 1 });
          break;
        case 'nameZ-A':
          queryBuilder = queryBuilder.sort({ firstName: -1, lastName: -1 });
          break;
        case 'newest':
          queryBuilder = queryBuilder.sort({ createdAt: -1 });
          break;
        case 'oldest':
          queryBuilder = queryBuilder.sort({ createdAt: 1 });
          break;
        default:
          queryBuilder = queryBuilder.sort({ createdAt: -1 });
      }
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    const contacts = await queryBuilder;

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404);
      return next(new Error(`Contact not found with id of ${req.params.id}`));
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      res.status(401);
      return next(new Error('User not authorized to access this contact'));
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Private
exports.createContact = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
exports.updateContact = async (req, res, next) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404);
      return next(new Error(`Contact not found with id of ${req.params.id}`));
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      res.status(401);
      return next(new Error('User not authorized to update this contact'));
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404);
      return next(new Error(`Contact not found with id of ${req.params.id}`));
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      res.status(401);
      return next(new Error('User not authorized to delete this contact'));
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete contacts
// @route   POST /api/contacts/bulk-delete
// @access  Private
exports.bulkDeleteContacts = async (req, res, next) => {
  try {
    const { contactIds } = req.body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      res.status(400);
      return next(new Error('Please provide an array of contactIds'));
    }

    await Contact.deleteMany({
      _id: { $in: contactIds },
      user: req.user.id
    });

    res.status(200).json({
      success: true,
      message: `${contactIds.length} contacts deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite status
// @route   PUT /api/contacts/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404);
      return next(new Error(`Contact not found with id of ${req.params.id}`));
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      res.status(401);
      return next(new Error('User not authorized to update this contact'));
    }

    contact.isFavorite = !contact.isFavorite;
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/contacts/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalContacts = await Contact.countDocuments({ user: req.user.id });
    const favoriteContacts = await Contact.countDocuments({ user: req.user.id, isFavorite: true });
    
    // Last 7 days contacts
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentContactsCount = await Contact.countDocuments({ 
      user: req.user.id,
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Get actual recent contacts
    const recentContacts = await Contact.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalContacts,
        favoriteContacts,
        recentContactsCount,
        recentContacts
      }
    });
  } catch (error) {
    next(error);
  }
};
