const asyncHandler = require("../middleware/asyncHandler");
const Admin = require("../models/admin");
const ErrorHandler = require("../middleware/ErrorHandler");
const TPA = require("../models/TPA");
const InsuranceCompany = require("../models/insuranceCompany");
const Hospital = require("../models/hospital");
const TPAName = require('../models/tpaName');
const InsuranceCompanyName = require('../models/insuranceCompanyName');
const sendMail = require('../middleware/sendMail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const PaginationAndFilter = require("../middleware/paginationAndFilter");
const multer = require("multer");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

require('dotenv').config();

exports.loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email }).select("+password"); // 
  if (!admin) return res.status(500).json({ success: false, message: "Admin Incorrect!", alert: true })
  const comparePassword = await admin.comparePassword(password)
  if (!comparePassword) return res.status(500).json({ success: false, message: "Password Incorrect!", alert: true })
  const token = await admin.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  req.admin = admin
  res.status(200).cookie("admntoken", token, options).json({
    success: true,
    token,
    message: "Login Successfully"
  });
});

// Logout Admin token
exports.logout = asyncHandler(async (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  res.cookie("admntoken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "logged out" })
});

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return next(new ErrorHandler("Registered Email Incorrect", 404));
    }

    // Get ResetPassword Token
    const resetToken = admin.getResetPasswordToken();

    await admin.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND}admin/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
      await sendMail({
        email: admin.email,
        subject: `Rohenii Password Recovery`,
        message,
      });

      res.status(200).json({
        success: true,
        message: `${admin.email}`,
      });
    } catch (error) {
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;

      await admin.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    next(new ErrorHandler(error.message, 400))
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!admin) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match confirm password", 400));
    }
    
    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    
    console.log(admin,"admin")
    await admin.save();
    const token = await admin.getJWTToken();

    // options for cookie
    const options = {
      expire: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    req.admin = admin;


    res.status(200).cookie("admintoken", token, options).json({
      success: true,
      message: "Password Change Successfully",
      admin,
      token,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400))
  }
};

exports.getAdminDetails = asyncHandler(async (req, res, next) => {
  if (!req?.admin) next(new ErrorHandler("Login First"));
  const admin = await Admin.findById(req.admin._id)
  if (!admin) next(new ErrorHandler("Login Expire Please Login First"))
  res.status(200).json({ success: true, message: "fetched", admin })
});

// ========================================= update details =====================================
exports.UpdateDetails = asyncHandler(async (req, res, next) => {
  const { name, mobile } = req.body;
  const findAdmin = await Admin.findById(req.admin?._id);
  if (!findAdmin) return next(new ErrorHandler("Admin not found!"))

  const updateAdmin = await Admin.findByIdAndUpdate(req.admin?._id, {
    name, mobile
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!updateAdmin) return next(new ErrorHandler("Admin not update"))
  await updateAdmin.save()

  res.status(200).json({ success: true, message: "Profile updated successfully!" })
})
// ========================================= update details =====================================

// ========================================= change password =====================================
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) return res.status(500).json({ success: false, message: "New password and confirm new password do not match!" })
  const findAdmin = await Admin.findById(req?.admin?._id).select("+password");
  if (!findAdmin) return next(new ErrorHandler("Sign-in first"))
  const comparePassword = await findAdmin.comparePassword(oldPassword)
  if (!comparePassword) return res.status(500).json({ success: false, message: "Password Mismatch!" })
  const updatePassword = await bcrypt.hash(newPassword, 10)
  const updateAdmin = await Admin.findByIdAndUpdate(findAdmin._id, { password: updatePassword }, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
  if (!updateAdmin) return next(new ErrorHandler("Password Not Updated"))
  res.status(200).json({ success: true, message: "Admin password updated successfully!" })
});
// ========================================= change password =====================================

// -------------- fetch all verified TPAs Count------------
exports.getAllVerifiedTPAsCount = asyncHandler(async (req, res, next) => {
  const count = await TPA.countDocuments({ isVerified: 'Approve' });
  res.status(200).json({
    success: true,
    count,
    message: "TPAs count fetched successfully"
  });
});
// -------------- fetch all verified TPAs Count------------

// -------------- fetch all verified insurance companies count ------------
exports.getAllVerifiedInsuranceCompaniesCount = asyncHandler(async (req, res, next) => {
  const count = await InsuranceCompany.countDocuments({ isVerified: 'Approve' });
  res.status(200).json({
    success: true,
    count,
    message: "InsuranceCompanies fetched successfully"
  });
});
// -------------- fetch all verified insurance companies count ------------

// ------------------ getAllVerifiedHospitalsCount -------------------
exports.getAllVerifiedHospitalsCount = asyncHandler(async (req, res, next) => {
  const count = await Hospital.countDocuments({ isVerified: 'Approve' });
  res.status(200).json({
    success: true,
    count,
    message: "Hospitals fetched successfully"
  });
});
// ------------------ getAllVerifiedHospitalsCount -------------------

// -------------- fetch all un-verified TPAs Count------------
exports.getAllUnVerifiedTPAsCount = asyncHandler(async (req, res, next) => {
  const count = await TPA.countDocuments({ isVerified: 'Request' });
  res.status(200).json({
    success: true,
    count,
    message: "TPAs count fetched successfully"
  });
});
// -------------- fetch all un-verified TPAs Count------------

// -------------- fetch all un-verified insurance companies count ------------
exports.getAllUnVerifiedInsuranceCompaniesCount = asyncHandler(async (req, res, next) => {
  const count = await InsuranceCompany.countDocuments({ isVerified: 'Request' });
  res.status(200).json({
    success: true,
    count,
    message: "InsuranceCompanies fetched successfully"
  });
});
// -------------- fetch all un-verified insurance companies count ------------

// ------------------ getAllUnVerifiedHospitalsCount -------------------
exports.getAllUnVerifiedHospitalsCount = asyncHandler(async (req, res, next) => {
  const count = await Hospital.countDocuments({ isVerified: 'Request' });
  res.status(200).json({
    success: true,
    count,
    message: "Hospitals fetched successfully"
  });
});
// ------------------ getAllUnVerifiedHospitalsCount -------------------

//------------------- verifyUnVerifyHospital ------------------------
exports.verifyUnVerifyHospital = asyncHandler(async (req, res, next) => {
  const hospitalId = req.params.hospitalId;
  const response = req.body.response;

  const hospital = await Hospital.findById(hospitalId).select('_id name isVerified')

  if (!hospital) {
    throw new Error("Hospital not found");
  }

  if (hospital.isVerified == "Approve") {
    return res.status(200).json({
      success: true,
      message: "Hospital account verification already approved",
      data: hospital
    });
  }
  if (response == "yes") {
    hospital.verifyAccount();
    const updatedHospital = await hospital.save();

    res.status(200).json({
      success: true,
      message: "Hospital account verification approved successfully",
      data: updatedHospital,
    });
  }
  else {
    hospital.unVerifyAccount();
    const updatedHospital = await hospital.save();

    res.status(200).json({
      success: true,
      message: "Hospital account verification rejected successfully",
      data: updatedHospital,
    });
  }
});
//------------------- verifyUnVerifyHospital ------------------------

//------------------- verifyTpa ------------------------
exports.verifyUnVerifyTpa = asyncHandler(async (req, res, next) => {
  const tpaId = req.params.tpaId;
  const response = req.body.response;

  const tpa = await TPA.findById(tpaId).select('_id name isVerified')

  if (!tpa) {
    throw new Error("TPA not found");
  }

  if (tpa.isVerified == "Approve") {
    return res.status(200).json({
      success: true,
      message: "Tpa account verification already approved",
      data: tpa
    });
  }
  if (response == "yes") {
    tpa.verifyAccount();
    const updatedTpa = await tpa.save();

    res.status(200).json({
      success: true,
      message: "Tpa account verification approved successfully",
      data: updatedTpa,
    });
  }
  else {
    tpa.unVerifyAccount();
    const updatedTpa = await tpa.save();

    res.status(200).json({
      success: true,
      message: "Tpa account verification rejected successfully",
      data: updatedTpa,
    });
  }
});
//------------------- verifyTpa ------------------------

//------------------- verifyUnVerifyInsuranceCompany ------------------------
exports.verifyUnverifyInsuranceCompany = asyncHandler(async (req, res, next) => {
  const insuranceCompanyId = req.params.insuranceCompanyId;
  const response = req.body.response;

  const insuranceCompany = await InsuranceCompany.findById(insuranceCompanyId).select('_id name isVerified')

  if (!insuranceCompany) {
    throw new Error("Insurance Company not found");
  }

  if (insuranceCompany.isVerified == "Approve") {
    return res.status(200).json({
      success: true,
      message: "Insurance Company account verification already approved",
      data: insuranceCompany
    });
  }
  if (response == "yes") {
    insuranceCompany.verifyAccount();
    const updatedInsuranceCompany = await insuranceCompany.save();

    res.status(200).json({
      success: true,
      message: "Insurance company account verification approved successfully",
      data: updatedInsuranceCompany,
    });
  }
  else {
    insuranceCompany.unVerifyAccount();
    const updatedInsuranceCompany = await insuranceCompany.save();

    res.status(200).json({
      success: true,
      message: "Insurance company account verification rejected successfully",
      data: updatedInsuranceCompany,
    });
  }
});
//------------------- verifyUnVerifyInsuranceCompany ------------------------

// ------------- update document hospital/tpa/insuranceCompany from 'Approve' to 'Reject' ------------------
exports.deleteApprovedTableDocument = asyncHandler(async (req, res, next) => {
  const tableName = req.params.tableName;
  const docId = req.params.documentId;
  let document;
  if (tableName == 'Hospital') {
    document = await Hospital.findById(docId).select('_id name isVerified');
  }
  else if (tableName == 'TPA') {
    document = await TPA.findById(docId).select('_id name isVerified');
  }
  else if (tableName == 'InsuranceCompany') {
    document = await InsuranceCompany.findById(docId).select('_id name isVerified');
  }

  if (!document) {
    throw new Error("Document not found");
  }

  document.unVerifyAccount();
  await document.save();

  res.status(200).json({
    success: true,
    message: "Document verification status changed to Rejected successfully",
  });
});
// ------------- update document hospital/tpa/insuranceCompany from 'Approve' to 'Reject' ------------------

// ------------- add tpa-name ------------------------
exports.addTPAName = asyncHandler(async (req, res, next) => {
  const { name,
    email,
    password,
    address
  } = req.body;

  // Create new TPA instance
  const newTPAName = new TPAName({
    name,
    email,
    password,
    address
  });

  // Save the TPAName to the database
  await newTPAName.save();

  res.status(201).json({
    success: true,
    message: 'TPAName registered successfully. Please update your password',
  });
});
// ------------- add tpa-name ------------------------

// ------------- add insurance-company-name ------------------------
exports.addInsuranceCompanyName = asyncHandler(async (req, res, next) => {
  const { name,
    email,
    password,
    address,
    establishedYear
  } = req.body;

  // Create new TPA instance
  const newInsuranceCompanyName = new InsuranceCompanyName({
    name,
    email,
    password,
    address,
    establishedYear
  });

  // Save the TPAName to the database
  await newInsuranceCompanyName.save();

  res.status(201).json({
    success: true,
    message: 'InsuranceCompanyName registered successfully. Please update your password',
  });
});
// ------------- add insurance-company-name ------------------------

// ------------------ getAllHospitalsRequest -------------------
exports.getAllHospitalsRequest = asyncHandler(async (req, res, next) => {
  const hospitals = await Hospital.find({ isVerified: 'Request' }).select('+password');
  res.status(200).json({
    success: true,
    hospitals,
    message: "Hospitals fetched successfully"
  });
});
// ------------------ getAllHospitalsRequest -------------------

// ------------------ getAllHospitalsDetails -------------------
exports.getAllHospitalsDetails = asyncHandler(async (req, res, next) => {
  const hospitals = await Hospital.find({ isVerified: 'Approve' }).select('+password');
  res.status(200).json({
    success: true,
    hospitals,
    message: "Hospitals fetched successfully"
  });
});
// ------------------ getAllHospitalsDetails -------------------

// -------------- fetch all insurance companies requests ------------
exports.getAllInsuranceCompaniesRequest = asyncHandler(async (req, res, next) => {
  const insurnaceCompanies = await InsuranceCompany.find({ isVerified: 'Request' }).select('+password').populate({
    path: 'nameId',
    select: '-_id name' // Only select the name field
  });
  res.status(200).json({
    success: true,
    insurnaceCompanies,
    message: "InsuranceCompanies Requests fetched successfully"
  });
});
// -------------- fetch all insurance companies requests ------------

// ------------------ getAllInsuranceCompaniesDetails -------------------
exports.getAllInsuranceCompaniesDetails = asyncHandler(async (req, res, next) => {
  const insuranceCompanies = await InsuranceCompany.find({ isVerified: 'Approve' }).select('+password').populate({
    path: 'nameId',
    select: '-_id name' // Only select the name field
  });
  res.status(200).json({
    success: true,
    insuranceCompanies,
    message: "Insurance companies fetched successfully"
  });
});
// ------------------ getAllInsuranceCompaniesDetails -------------------

// -------------- fetch all TPAs Request ------------
exports.getAllTPAsRequest = asyncHandler(async (req, res, next) => {
  const tpas = await TPA.find({ isVerified: "Request" }).select('+password').populate({
    path: 'nameId',
    select: '-_id name' // Only select the name field
  });
  res.status(200).json({
    success: true,
    tpas,
    message: "TPAs requests fetched successfully"
  });
});
// -------------- fetch all TPAs Request ------------

// ------------------ getAllTPADetails -------------------
exports.getAllTPADetails = asyncHandler(async (req, res, next) => {
  const tpas = await TPA.find({ isVerified: 'Approve' }).select('+password').populate({
    path: 'nameId',
    select: '-_id name' // Only select the name field
  });
  res.status(200).json({
    success: true,
    tpas,
    message: "TPAs fetched successfully"
  });
});
// ------------------ getAllTPADetails -------------------

// ------------- paid membership hospitals having excludedByTPAorInsuranceCompany ---------------
exports.getExcludedHospitalList = asyncHandler(async (req, res, next) => {
  const { listType } = req.query;
  let hospitals;
  if (listType == 'Paid') {
    hospitals = await Hospital.find({
      membershipStatus: listType,
      isVerified: 'Approve',
      // $or: [
      //   { excludedByTPAs: { $exists: true, $ne: [] } }, // At least one value in excludedByTPAs
      //   { excludedByInsuranceCompanies: { $exists: true, $ne: [] } } // At least one value in excludedByInsuranceCompanies
      // ]
    });
  }
  else if (listType == 'Unpaid') {
    hospitals = await Hospital.find({
      membershipStatus: listType,
      isVerified: 'Approve',
      // $or: [
      //   { excludedByTPAs: { $exists: true, $ne: [] } }, // At least one value in excludedByTPAs
      //   { excludedByInsuranceCompanies: { $exists: true, $ne: [] } } // At least one value in excludedByInsuranceCompanies
      // ]
    });
  }
  else if (listType == 'Renewal') {
    hospitals = await Hospital.find({
      membershipStatus: listType,
      isVerified: 'Approve',
      // $or: [
      //   { excludedByTPAs: { $exists: true, $ne: [] } }, // At least one value in excludedByTPAs
      //   { excludedByInsuranceCompanies: { $exists: true, $ne: [] } } // At least one value in excludedByInsuranceCompanies
      // ]
    });
  }
  res.status(200).json({
    success: true,
    count: hospitals.length,
    data: hospitals
  });
});
// ------------- paid membership hospitals having excludedByTPAorInsuranceCompany ---------------

// ========================================= Get Single hospital =====================================
exports.GetSingleHospital = asyncHandler(async (req, res, next) => {
  let hospital = await Hospital.findById(req.params.id)
  res.status(200).json({ success: true, message: "hospital fetched successfully!", hospital })
})

exports.updateMembershipStatus = asyncHandler(async (req, res, next) => {
  const { status, id } = req.params;

  // Validate the status
  const validStatuses = ['Paid', 'Unpaid', 'Renewal'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid membership status." });
  }

  const hospital = await Hospital.findById(id);
  if (!hospital) {
    return res.status(404).json({ message: "Hospital not found." });
  }

  hospital.membershipStatus = status;

  if (status === 'Paid') {
    hospital.membershipBoughtDate = Date.now();
    // Automatically set renewal date
    hospital.membershipRenewalDate = new Date(hospital.membershipBoughtDate);
    hospital.membershipRenewalDate.setFullYear(hospital.membershipRenewalDate.getFullYear() + 1);
  } else if (status === 'Renewal') {
    // Set renewal date to one year from now, keep bought date unchanged
    hospital.membershipRenewalDate = new Date();
    hospital.membershipRenewalDate.setFullYear(hospital.membershipRenewalDate.getFullYear() + 1);
    // Optional: You might want to set membershipBoughtDate to now as well
    hospital.membershipBoughtDate = Date.now();
  } else if (status === 'Unpaid') {
    // Clear dates if membership is unpaid
    hospital.membershipBoughtDate = null;
    hospital.membershipRenewalDate = null;
  }

  await hospital.save();

  res.status(200).json({
    message: "Membership status updated successfully.", hospital
  });
});

exports.getAllHospitalDataExcludeBy = asyncHandler(async (req, res, next) => {
  const by = req.params.by;
  let excludedBy;

  if (by === 'insurance-company') {
    excludedBy = 'excludedByInsuranceCompanies';
  }
  else if (by === 'tpa') {
    excludedBy = 'excludedByTPAs';
  }
  // Fetch hospitals where 'excludedByInsuranceCompanies' has any entries
  const hospitals = await Hospital.find({ [excludedBy]: { $gt: [] } })
    .populate({
      path: `${excludedBy}`, // Populate the 'excludedByInsuranceCompanies' field
      select: '_id nameId',  // Select relevant details of the insurance company
      populate: {
        path: 'nameId', // Populate the 'nameId' field which is a reference to InsuranceCompanyName model
        select: 'name',  // Select relevant details from the InsuranceCompanyName model
      }
    })
    .select(`name email contactNumber address district state pincode ${excludedBy}`);  // Select relevant fields from the hospital model

  // Check if no hospitals are found
  if (hospitals.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No hospitals found that are excluded by any ${by}`,
    });
  }

  // Flatten the data to meet the row-by-row format
  const result = [];
  hospitals.forEach(hospital => {
    // For each insurance company that excluded the hospital, create a separate row
    hospital[excludedBy].forEach(entity => {
      result.push({
        hospitalId: hospital._id,
        hospitalName: hospital.name,
        hospitalEmail: hospital.email,
        hospitalContactNumber: hospital.contactNumber,
        hospitalAddress: hospital.address,
        hospitalDistrict: hospital.district,
        hospitalState: hospital.state,
        hospitalPincode: hospital.pincode,
        [excludedBy]: entity._id,
        excludedByEntityName: entity.nameId.name,  // Name of the Insurance Company
      });
    });
  });

  // Return the flattened data as rows
  res.status(200).json({
    success: true,
    data: result,
  });
});

// ------------------ exclude hospital -------------------
exports.excludeHospital = asyncHandler(async (req, res, next) => {
  if (!req.admin) return res.status(404).json({ success: false, message: 'Admin Sign-in first' });

  const by = req.params.by;
  const hospitalId = req.params.hospitalId;

  // Find the hospital by ID
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Hospital not found' });
  }

  if (by == 'insurance-company') {
    const insuranceCompanyId = req.params.tpaInsuranceCompanyId;
    const insuranceCompany = await InsuranceCompany.findById(insuranceCompanyId);

    if (!insuranceCompany) {
      return res.status(404).json({ message: 'Insurance Company not found' });
    }

    // Check if the hospital is already excluded
    const alreadyExcluded3 = hospital.adminApprovedExcludedByInsuranceCompanies.includes(insuranceCompanyId);

    if (alreadyExcluded3) {
      return res.status(400).json({ success: false, message: 'Hospital already excluded' });
    }
    hospital.adminApprovedExcludedByInsuranceCompanies.push(insuranceCompanyId);
  }
  else if (by == 'tpa') {
    const tpaId = req.params.tpaInsuranceCompanyId;
    const tpa = await TPA.findById(tpaId);

    if (!tpa) {
      return res.status(404).json({ message: 'TPA not found' });
    }

    // Check if the hospital is already excluded
    const alreadyExcluded3 = hospital.adminApprovedExcludedByTPAs.includes(tpaId);

    if (alreadyExcluded3) {
      return res.status(400).json({ success: false, message: 'Hospital already excluded' });
    }
    hospital.adminApprovedExcludedByTPAs.push(tpaId);
  }

  await hospital.save();

  return res.status(200).json({ success: true, message: 'Hospital exclude request approved' });
});
// ------------------ exclude hospital -------------------

// ------------------ unexclude hospital -----------------
exports.unExcludeHospital = asyncHandler(async (req, res, next) => {
  if (!req.admin) return res.status(404).json({ success: false, message: 'Admin Sign-in first' });

  const by = req.params.by;
  const hospitalId = req.params.hospitalId;

  // Find the hospital by ID
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Hospital not found' });
  }

  if (by == 'insurance-company') {
    const insuranceCompanyId = req.params.tpaInsuranceCompanyId;
    const insuranceCompany = await InsuranceCompany.findById(insuranceCompanyId);

    if (!insuranceCompany) {
      return res.status(404).json({ message: 'Insurance Company not found' });
    }

    // Check if the hospital is already unexcluded
    const alreadyExcluded3 = hospital.adminApprovedExcludedByInsuranceCompanies.includes(insuranceCompanyId);

    if (!alreadyExcluded3) {
      return res.status(400).json({ success: false, message: 'Hospital already unexcluded' });
    }

    const indexInHospital = hospital.adminApprovedExcludedByInsuranceCompanies.indexOf(insuranceCompanyId);

    // Remove the insuranceCompanyID from the adminApprovedExcludedByInsuranceCompanies array
    hospital.adminApprovedExcludedByInsuranceCompanies.splice(indexInHospital, 1);
    hospital.membershipStatus = 'Unpaid';

    // Removing the insuranceCompanyId from excludedByInsuranceCompanies array in Hospital model
    const indexInHospital1 = hospital.excludedByInsuranceCompanies.indexOf(insuranceCompanyId);
    hospital.excludedByInsuranceCompanies.splice(indexInHospital1, 1);

    await hospital.save();

    const indexInInsuranceCompany = insuranceCompany.excludedHospitals.indexOf(hospitalId);

    // Remove the hospital ID from the excludedByInsuranceCompanies array
    insuranceCompany.excludedHospitals.splice(indexInInsuranceCompany, 1);
    await insuranceCompany.save();
  }

  else if (by == 'tpa') {
    const tpaId = req.params.tpaInsuranceCompanyId;
    const tpa = await TPA.findById(tpaId);

    if (!tpa) {
      return res.status(404).json({ message: 'TPA not found' });
    }

    // Check if the hospital is already unexcluded
    const alreadyExcluded3 = hospital.adminApprovedExcludedByTPAs.includes(tpaId);

    if (!alreadyExcluded3) {
      return res.status(400).json({ success: false, message: 'Hospital already unexcluded' });
    }

    const indexInHospital = hospital.adminApprovedExcludedByTPAs.indexOf(tpaId);

    // Remove the tpaId from the adminApprovedExcludedByTPAs array
    hospital.adminApprovedExcludedByTPAs.splice(indexInHospital, 1);
    hospital.membershipStatus = 'Unpaid';

    // Removing the tpaId from excludedByTPAs array in Hospital model
    const indexInHospital1 = hospital.excludedByTPAs.indexOf(tpaId);
    hospital.excludedByTPAs.splice(indexInHospital1, 1);

    await hospital.save();

    const indexInTPA = tpa.excludedHospitals.indexOf(hospitalId);

    // Remove the hospitalId from the excludedHospitals array
    tpa.excludedHospitals.splice(indexInTPA, 1);
    await tpa.save();
  }

  res.status(200).json({ success: true, message: 'Hospital unexcluded successfully' });
})
// ------------------ unexclude hospital -----------------

// -------------------------------SUB ADMIN------------------------------
exports.createSubadmin = asyncHandler(async (req, res, next) => {
  const { name,
    email,
    mobile,
    password
  } = req.body;

  // Create new Admin instance
  const newSubadmin = new Admin({
    name,
    email,
    mobile,
    password,
    role: 'Subadmin'
  });

  // Save the TPAName to the database
  await newSubadmin.save();

  res.status(201).json({
    success: true,
    message: 'Subadmin created successfully',
  });
});

exports.getAllSubadminDetails = asyncHandler(async (req, res, next) => {
  const subadmins = await Admin.find({ role: 'Subadmin' });
  res.status(200).json({
    success: true,
    subadmins,
    message: "Subadmins fetched successfully"
  });
});

// Delete Subadmin Controller
exports.deleteSubAdmin = asyncHandler(async (req, res, next) => {
  const subadminId = req.params.subadminId;

  // Find subadmin by ID
  const subadmin = await Admin.findById(subadminId);

  // Check if subadmin exists
  if (!subadmin) {
    return res.status(404).json({
      success: false,
      message: "Subadmin not found",
    });
  }

  // Check if the user is trying to delete an admin or someone without proper privileges
  if (subadmin.role === 'Admin') {
    return res.status(400).json({
      success: false,
      message: "Cannot delete an admin user.",
    });
  }

  // Delete the subadmin
  await Admin.findByIdAndDelete(subadminId);

  // Send response back
  return res.status(200).json({
    success: true,
    message: "Subadmin deleted successfully",
  });
});
//-----------------------------------------------SUB ADMIN--------------------------------------------------

exports.exportHospitalsToExcel = asyncHandler(async (req, res, next) => {
  const workbook = await Hospital.exportToExcel();

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=hospitals.xlsx");

  // Write the Excel file to the response
  await workbook.xlsx.write(res);
  res.end();
});

exports.importHospitalsFromExcel = [
  upload.single("file"), // Expecting the file field to be named "file"
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a file" });
    }

    // Use the model's import method to process the file
    await Hospital.importFromExcel(req.file.path); // Pass the file path

    res.status(200).json({ success: true, message: "Hospitals imported successfully" });
  }),
];



