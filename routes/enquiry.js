const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

// POST route for creating a new contact entry
router.post('/create', enquiryController.createEnquiry);

module.exports = router;
