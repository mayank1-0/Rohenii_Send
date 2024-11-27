const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const { createOrUpdateContactUsDetails, getContactUsDetails } = require('../controllers/contactUs');

// Route to create or update Contact Us content
router.post('/create-contact-us', isAdmin, createOrUpdateContactUsDetails);

// Route to get Contact Us content
router.get('/get-contact-us', getContactUsDetails);

module.exports = router;
