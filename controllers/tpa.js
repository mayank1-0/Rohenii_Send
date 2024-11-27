const asyncHandler = require("../middleware/asyncHandler");
const ErrorHandler = require("../middleware/ErrorHandler");
const TPA = require("../models/TPA");
const Hospital = require("../models/hospital");
const sendMail = require('../middleware/sendMail'); // Hypothetical function for sending OTP email
const GanerateOTP = require('../middleware/GanerateOTP');
require('dotenv').config();

// Logout TPA token
exports.logout = asyncHandler(async (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  res.cookie("tpatoken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "logged out" })
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) return res.status(500).json({ success: false, message: "New password and confirm new password do not match!" })
  const findTpa = await TPA.findById(req?.tpa?._id).select("+password");
  if (!findTpa) return next(new ErrorHandler("Sign-in first"))
  const comparePassword = await findTpa.comparePassword(oldPassword)
  if (!comparePassword) return res.status(500).json({ success: false, message: "Password Mismatch!" })
  const updateTpa = await TPA.findByIdAndUpdate(findTpa._id, { password: newPassword }, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
  if (!updateTpa) return next(new ErrorHandler("Password Not Updated"))
  res.status(200).json({ success: true, message: "Tpa password updated successfully!"})
});
// ========================================= change password =====================================

// ------------------- signup  --------------------
exports.signupTPA = asyncHandler(async (req, res, next) => {
  const { nameId,
    contactPerson,
    email,
    contactNumber,
    department,
    designation,
    password,
    excludedHospitals = []
  } = req.body;

  // Generate OTP and its expiration
  // const otp = GanerateOTP(); // Generates a random OTP
  // const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

  // Create new TPA instance
  const newTPA = new TPA({
    nameId,
    contactPerson,
    email,
    contactNumber,
    department,
    designation,
    password,
    excludedHospitals
  });

  // Save the TPA to the database
  await newTPA.save();

  // Update excluded hospitals with the new TPA ID
  if (excludedHospitals.length > 0) {
    await Hospital.updateMany(
      { _id: { $in: excludedHospitals } },
      { $addToSet: { excludedByTPAs: newTPA._id } } // Use $addToSet to avoid duplicates
    );
  }

  // const option = { email, message: `OTP for verification is ${otp}. It's valid till ${otpExpiration}`, subject: `OTP`, condidate: null };
  // // Send OTP email (implement this function based on your email service)
  // await sendMail(option);

  res.status(201).json({
    success: true,
    message: 'TPA registered successfully. Please wait till admin approves your signup request.',
  });
});
// ------------------- signup -------------------

// ------------------- signin -------------------
exports.signinTPA = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const tpa = await TPA.findOne({ email: email }).select("+password");
  if (!tpa) return res.status(500).json({ success: false, message: "tpa Incorrect!" })
  const comparePassword = await tpa.comparePassword(password)
  if (!comparePassword) return res.status(500).json({ success: false, message: "Password Incorrect!" })
  const token = await tpa.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  req.tpa = tpa
  res.status(200).cookie("tpatoken", token, options).json({
    success: true,
    token,
    message: "Login Successfully"
  });
});
// ------------------- signin -------------------

// ------------------ exclude hospital -------------------
exports.excludeHospital = asyncHandler(async (req, res, next) => {
  if (!req.tpa) return res.status(404).json({ success: false, message: 'Sign-in first' });

  const hospitalId = req.params.id;
  const tpa = req.tpa;

  if(tpa.isVerified !== "Approve"){
    return res.status(403).json({ success: false, message: 'Wait till your account verification is approved by the admin'});
  };

  // Find the hospital by ID and update the excludedByInsuranceCompanies array
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Hospital not found' });
  }

  // Check if the hospital is already excluded
  const alreadyExcluded1 = tpa.excludedHospitals.includes(hospitalId);
  const alreadyExcluded2 = hospital.excludedByTPAs.includes(tpa._id);
  if (alreadyExcluded1 && alreadyExcluded2) {
    return res.status(400).json({ success: false, message: 'Hospital exclusion request already sent to admin' });
  }

  // Add logic to exclude the hospital from the list
  // Here we could add the logic to save the exclusion, e.g., pushing to excludedByInsuranceCompanies array

  // Example: Excluding the hospital by pushing its ID to the TPA's excludedHospitals array
  // Assuming you have access to the TPA model
  tpa.excludedHospitals.push(hospitalId);
  await tpa.save();

  // Mark the hospital as excluded (you could also create a field for this)
  hospital.excludedByTPAs.push(tpa._id); // Assuming you're tracking which user excluded it
  await hospital.save();

  return res.status(200).json({ success: true, message: 'Hospital exclusion request sent to admin successfully' });
});
// ------------------ exclude hospital -------------------

// ------------------ un-exclude hospital -------------------
exports.unExcludeHospital = asyncHandler(async (req, res, next) => {
  if (!req.tpa) return res.status(404).json({ success: false, message: 'Sign-in first' });

  const hospitalId = req.params.id;
  const tpa = req.tpa;

  // Find the hospital by ID
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Hospital not found' });
  }

  // Check if the hospital is un-excluded
  const alreadyUnExcluded1 = hospital.excludedByTPAs.includes(tpa._id);
  const alreadyUnExcluded2 = tpa.excludedHospitals.includes(hospitalId);
  if (!alreadyUnExcluded1 && !alreadyUnExcluded2) {
    return res.status(400).json({ success: false, message: 'Hospital already un-excluded' });
  }

  const indexInHospital = hospital.excludedByTPAs.indexOf(tpa._id);

  // Remove the hospital ID from the excludedByInsuranceCompanies array
  hospital.excludedByTPAs.splice(indexInHospital, 1);
  hospital.membershipStatus = 'Not_Required';
  await hospital.save();


  const indexInTPA = tpa.excludedHospitals.indexOf(hospitalId);

  // Remove the hospital ID from the excludedByInsuranceCompanies array
  tpa.excludedHospitals.splice(indexInTPA, 1);
  await tpa.save();
  return res.status(200).json({ success: true, message: 'Hospital unexcluded successfully' });
});
// ------------------ un-exclude hospital -------------------