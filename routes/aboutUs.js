const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const { createOrUpdateAboutUs, getAboutUs } = require('../controllers/aboutUs');

// Route to create or update About Us content
router.post('/create-about-us', isAdmin, createOrUpdateAboutUs);

// Route to get About Us content
router.get('/get-about-us', getAboutUs);

module.exports = router;
