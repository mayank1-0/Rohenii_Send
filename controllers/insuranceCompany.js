const asyncHandler = require("../middleware/asyncHandler");
const ErrorHandler = require("../middleware/ErrorHandler");
const InsuranceCompany = require("../models/insuranceCompany");
const InsuranceCompanyName = require("../models/insuranceCompanyName");
const Hospital = require("../models/hospital");
require('dotenv').config();

// Logout Insurance company token
exports.logout = asyncHandler(async (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  res.cookie("insuranceCompanytoken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "logged out" })
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) return res.status(500).json({ success: false, message: "New password and confirm new password do not match!" })
  const findInsuranceCompany = await InsuranceCompany.findById(req?.insuranceCompany?._id).select("+password");
  if (!findInsuranceCompany) return next(new ErrorHandler("Sign-in first"))
  const comparePassword = await findInsuranceCompany.comparePassword(oldPassword)
  if (!comparePassword) return res.status(500).json({ success: false, message: "Password Mismatch!" })
  const updateInsuranceCompany = await InsuranceCompany.findByIdAndUpdate(findInsuranceCompany._id, { password: newPassword }, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
  if (!updateInsuranceCompany) return next(new ErrorHandler("Password Not Updated"))
  res.status(200).json({ success: true, message: "Insurance Company password updated successfully!" })
});
// ========================================= change password =====================================

// ------------------- signup  --------------------
exports.signupInsuranceCompany = asyncHandler(async (req, res, next) => {
  const { nameId,
    contactPerson,
    email,
    contactNumber,
    address,
    establishedYear,
    password,
    excludedHospitals = []
  } = req.body;


  // Create new InsuranceCompany instance
  const newInsuranceCompany = await InsuranceCompany.create({
    nameId,
    contactPerson,
    email,
    contactNumber,
    address,
    establishedYear,
    password,
    excludedHospitals
  });



  // Update excluded hospitals with the new InsuranceCompany ID
  if (excludedHospitals.length > 0) {
    await Hospital.updateMany(
      { _id: { $in: excludedHospitals } },
      { $addToSet: { excludedByInsuranceCompanies: newInsuranceCompany._id } } // Use $addToSet to avoid duplicates
    );
  }

  res.status(201).json({
    success: true,
    message: 'InsuranceCompany registered successfully. Please wait till admin approves your signup request.',
  });
});
// ------------------- signup --------------------

// ------------------- signin --------------------
exports.signinInsuranceCompany = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const insuranceCompany = await InsuranceCompany.findOne({ email: email }).select("+password");
  if (!insuranceCompany) return res.status(500).json({ success: false, message: "insuranceCompany Incorrect!" })
  const comparePassword = await insuranceCompany.comparePassword(password)
  if (!comparePassword) return res.status(500).json({ success: false, message: "Password Incorrect!" })
  const token = await insuranceCompany.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  req.insuranceCompany = insuranceCompany
  res.status(200).cookie("insuranceCompanytoken", token, options).json({
    success: true,
    token,
    message: "Login Successfully"
  });
});
// ------------------- signin --------------------

// -------------- fetch all insurance companies count ------------
exports.getAllInsuranceCompaniesCount = asyncHandler(async (req, res, next) => {
  const count = await InsuranceCompany.countDocuments({});
  res.status(200).json({
    success: true,
    count,
    message: "InsuranceCompanies fetched successfully"
  });
});
// -------------- fetch all insurance companies count ------------

// ------------------ exclude hospital -------------------
exports.excludeHospital = asyncHandler(async (req, res, next) => {
  if (!req.insuranceCompany) return res.status(404).json({ success: false, message: 'Sign-in first' });

  const hospitalId = req.params.id;
  const insuranceCompany = req.insuranceCompany;

  if (insuranceCompany.isVerified !== "Approve") {
    return res.status(403).json({ success: false, message: 'Wait till your account verification is approved by the admin' });
  };

  // Find the hospital by ID and update the excludedByInsuranceCompanies array
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Hospital not found' });
  }

  // Check if the hospital is already excluded
  const alreadyExcluded1 = insuranceCompany.excludedHospitals.includes(hospitalId);
  const alreadyExcluded2 = hospital.excludedByInsuranceCompanies.includes(insuranceCompany._id);
  if (alreadyExcluded1 && alreadyExcluded2) {
    return res.status(400).json({ success: false, message: 'Hospital exclusion request already sent to admin' });
  }

  // Add logic to exclude the hospital from the list
  // Here we could add the logic to save the exclusion, e.g., pushing to excludedByInsuranceCompanies array

  // Example: Excluding the hospital by pushing its ID to the InsuranceCompany's excludedHospitals array
  // Assuming you have access to the InsuranceCompany model
  insuranceCompany.excludedHospitals.push(hospitalId);
  await insuranceCompany.save();

  // Mark the hospital as excluded (you could also create a field for this)
  hospital.excludedByInsuranceCompanies.push(insuranceCompany._id); // Assuming you're tracking which user excluded it
  await hospital.save();

  return res.status(200).json({ success: true, message: 'Hospital exclusion request sent to admin successfully' });
});
// ------------------ exclude hospital -------------------

// ------------------ un-exclude hospital -------------------
exports.unExcludeHospital = asyncHandler(async (req, res, next) => {
  const hospitalId = req.params.id;
  const insuranceCompany = req.insuranceCompany;

  // Find the hospital by ID
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Hospital not found' });
  }

  // Check if the hospital is unexcluded
  const alreadyUnExcluded1 = hospital.excludedByInsuranceCompanies.includes(insuranceCompany._id);
  const alreadyUnExcluded2 = insuranceCompany.excludedHospitals.includes(hospitalId);
  if (!alreadyUnExcluded1 && !alreadyUnExcluded2) {
    return res.status(400).json({ success: false, message: 'Hospital already un-excluded' });
  }

  const indexInHospital = hospital.excludedByInsuranceCompanies.indexOf(insuranceCompany._id);

  // Remove the hospital ID from the excludedByInsuranceCompanies array
  hospital.excludedByInsuranceCompanies.splice(indexInHospital, 1);
  hospital.membershipStatus = 'Not_Required';
  await hospital.save();

  const indexInInsuranceCompany = insuranceCompany.excludedHospitals.indexOf(hospitalId);

  // Remove the hospital ID from the excludedByInsuranceCompanies array
  insuranceCompany.excludedHospitals.splice(indexInInsuranceCompany, 1);
  await insuranceCompany.save();

  return res.status(200).json({ success: true, message: 'Hospital unexcluded successfully' });
});
// ------------------ un-exclude hospital -------------------