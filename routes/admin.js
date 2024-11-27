const { loginAdmin, logout, forgotPassword, resetPassword, getAdminDetails,
    UpdateDetails, changePassword, getAllVerifiedTPAsCount, getAllVerifiedInsuranceCompaniesCount,
    getAllVerifiedHospitalsCount, getAllUnVerifiedTPAsCount, getAllUnVerifiedInsuranceCompaniesCount,
    getAllUnVerifiedHospitalsCount, verifyUnVerifyHospital, verifyUnVerifyTpa,
    verifyUnverifyInsuranceCompany, deleteApprovedTableDocument, addTPAName,
    addInsuranceCompanyName, getAllHospitalsRequest, getAllHospitalsDetails,
    getAllInsuranceCompaniesRequest, getAllInsuranceCompaniesDetails, getAllTPAsRequest,
    getAllTPADetails, getExcludedHospitalList, GetSingleHospital, 
    updateMembershipStatus, getAllHospitalDataExcludeBy, excludeHospital, unExcludeHospital,
    createSubadmin, getAllSubadminDetails, deleteSubAdmin,
    exportHospitalsToExcel, importHospitalsFromExcel } = require("../controllers/admin");
const router = require("express").Router();
const isAdmin = require('../middleware/isAdmin');

//admin auth
router.route("/login").post(loginAdmin);
router.route("/logout").get(isAdmin, logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/details").get(isAdmin,getAdminDetails);
router.route("/update-details").post(isAdmin,UpdateDetails);
router.route("/change-password").post(isAdmin,changePassword);
//admin auth

//---------- fetch all verified TPAs count ---------
router.route("/getAllVerifiedTPAsCount").get(isAdmin, getAllVerifiedTPAsCount);
//---------- fetch all verified TPAs ---------

//---------- fetch all verified insurance companies count ---------
router.route("/getAllVerifiedInsuranceCompaniesCount").get(isAdmin, getAllVerifiedInsuranceCompaniesCount);
//---------- fetch all verified insurance companies count ---------

//---------- fetch all verified hospitals count ---------
router.route("/getAllVerifiedHospitalsCount").get(isAdmin, getAllVerifiedHospitalsCount);
//---------- fetch all verified hospitals count ---------

//---------- fetch all un-verified TPAs ---------
router.route("/getAllUnVerifiedTPAsCount").get(isAdmin, getAllUnVerifiedTPAsCount);
//---------- fetch all un-verified TPAs ---------

//---------- fetch all un-verified insurance companies count ---------
router.route("/getAllUnVerifiedInsuranceCompaniesCount").get(isAdmin, getAllUnVerifiedInsuranceCompaniesCount);
//---------- fetch all un-verified insurance companies count ---------

//---------- fetch all un-verified hospitals count ---------
router.route("/getAllUnVerifiedHospitalsCount").get(isAdmin, getAllUnVerifiedHospitalsCount);
//---------- fetch all un-verified hospitals count ---------

// ------------- verify-unverify hospital -----------------
router.route('/verify-unverify-hospital/:hospitalId').put(isAdmin, verifyUnVerifyHospital);
// ------------- verify-unverify hospital -----------------

// ------------- verify-unverify TPA -----------------
router.route('/verify-unverify-tpa/:tpaId').put(isAdmin, verifyUnVerifyTpa);
// ------------- verify-unverify TPA -----------------

// ------------- verify-unverify Insurance Company -----------------
router.route('/verify-unverify-insuranceCompany/:insuranceCompanyId').put(isAdmin, verifyUnverifyInsuranceCompany);
// ------------- verify-unverify Insurance Company -----------------

// ------------- update document hospital/tpa/insuranceCompany from 'Approve' to 'Reject' ------------------
router.route('/delete/:tableName/:documentId').put(isAdmin, deleteApprovedTableDocument);
// ------------- update document hospital/tpa/insuranceCompany from 'Approve' to 'Reject' ------------------

// -------------------------- TPA-Name ---------------------------------------------
// ------------------------- add -------------------------------
router.route('/add-tpa-name').post(isAdmin, addTPAName);
// ------------------------- add -------------------------------
// -------------------------- TPA-Name ---------------------------------------------

// -------------------------- Insurance Company-Name ---------------------------------------------
// ------------------------- add -------------------------------
router.route('/add-insurance-company-name').post(isAdmin, addInsuranceCompanyName);
// ------------------------- add -------------------------------
// -------------------------- Insurance Company-Name ---------------------------------------------

//---------- fetch all hospital request ---------
router.route("/getAllHospitalsRequest").get(isAdmin, getAllHospitalsRequest);
//---------- fetch all hospital request ---------

//---------- fetch all hospital details ---------
router.route("/getAllHospitalsDetails").get(isAdmin, getAllHospitalsDetails);
//---------- fetch all hospital details ---------

//---------- fetch all insurance companies ---------
router.route("/getAllInsuranceCompaniesRequest").get(isAdmin, getAllInsuranceCompaniesRequest);
//---------- fetch all insurance companies ---------

//---------- fetch all Insurance Companies details ---------
router.route("/getAllInsuranceCompaniesDetails").get(isAdmin, getAllInsuranceCompaniesDetails);
//---------- fetch all Insurance Companies details ---------

//---------- fetch all TPAs ---------
router.route("/getAllTPAsRequest").get(isAdmin, getAllTPAsRequest);
//---------- fetch all TPAs ---------

//---------- fetch all tpa details ---------
router.route("/getAllTPADetails").get(isAdmin, getAllTPADetails);
//---------- fetch all tpa details ---------

//---------- fetch hospital list ---------
router.route("/excluded-hospital-list").get(isAdmin, getExcludedHospitalList);
//---------- fetch hospital list ---------

//---------- get hospital by id ---------------------
router.route("/hospital-by-id/:id").get(isAdmin,GetSingleHospital);
//---------- get hospital by id ---------------------

//----------------- update membership status -------------
router.route("/update-membership-status/:status/:id").put(isAdmin, updateMembershipStatus);
//------------------update membership status ------------

//------------------export excel to excel file------------------
router.get("/export", exportHospitalsToExcel);
//------------------export excel to excel file------------------

//------------------import excel to excel file------------------
router.post("/import", importHospitalsFromExcel);
//------------------import excel to excel file------------------

//------------------get all hospitals excluded/unexcluded by Insurance Company/TPA Data ------------------------------
router.get("/get-all-hospitals-data-exclude/:by", getAllHospitalDataExcludeBy);
//------------------get all hospitals excluded/unexcluded by Insurance Company/TPA Data ------------------------------

// ------------ exclude hospital --------------
router.route("/exclude-hospital/:by/:hospitalId/:tpaInsuranceCompanyId").post(isAdmin, excludeHospital);
// ------------ exclude hospital --------------

// ------------ un-exclude hospital --------------
router.route("/unexclude-hospital/:by/:hospitalId/:tpaInsuranceCompanyId").post(isAdmin, unExcludeHospital);
// ------------ un-exclude hospital --------------

// =======================SUB ADMIN======================================
//---------------------------create subadmin-----------------------------
router.route("/create-subadmin").post(isAdmin, createSubadmin);
//---------------------------create subadmin-----------------------------

//--------------------------- get all subadmin details --------------------------------
router.route("/get-all-subadmin-details").get(isAdmin, getAllSubadminDetails);
//--------------------------- get all subadmin details --------------------------------

//--------------------------- delete subadmin ----------------------------
router.route('/delete-subadmin/:subadminId').delete(isAdmin, deleteSubAdmin);
//--------------------------- delete subadmin ----------------------------

module.exports = router;