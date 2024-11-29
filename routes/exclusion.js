const express = require('express');
const router = express.Router();
const exclusionController = require('../controllers/exclusionController');
const isAdmin = require('../middleware/isAdmin');

// POST route for creating a new exclusion entry
router.post('/create', isAdmin, exclusionController.createExclusion);
router.get('/get-all-exclusion', isAdmin, exclusionController.getAllExclusions);
router.get('/get-exclusion/:id', isAdmin, exclusionController.getExclusionById);
router.put('/update-exclusion-status/:status/:id', isAdmin, exclusionController.updateExclusionStatus);
router.delete('/delete-exclusion', isAdmin, exclusionController.deleteExclusion);

module.exports = router;
