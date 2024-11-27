const asyncHandler = require("../middleware/asyncHandler");
const ErrorHandler = require("../middleware/ErrorHandler");
const Hospital = require("../models/hospital");
const InsuranceCompany = require("../models/insuranceCompany");
require('dotenv').config();

// ------------------- signup  --------------------
exports.signupHospital = asyncHandler(async (req, res, next) => {
    const { name,
        contactPerson,
        email,
        contactNumber,
        address,
        district,
        pincode,
        state,
        password
    } = req.body;

    // Create new Hospital instance
    const newHospital = new Hospital({
        name,
        contactPerson,
        email,
        contactNumber,
        address,
        district,
        pincode,
        state,
        password
    });

    // Save the Hospital to the database
    await newHospital.save();

    res.status(201).json({
        success: true,
        message: 'Hospital registered successfully. Please verify your email using the OTP sent.',
    });
});
// ------------------- signup --------------------

// ------------------ getAllHospitalsDetails -------------------
exports.getAllHospitalsDetails = asyncHandler(async (req, res, next) => {
    const hospitals = await Hospital.find({ isVerified: 'Approve' });
    res.status(200).json({
        success: true,
        hospitals,
        message: "Hospitals fetched successfully"
    });
  });
  // ------------------ getAllHospitalsDetails -------------------
