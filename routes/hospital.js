const { signupHospital, getAllHospitalsDetails, exportExcel, importExcel } = require("../controllers/hospital.js");
const router = require("express").Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


// ------------ sign up --------------
router.route("/sign-up").post(signupHospital);
// ------------ sign up --------------

// ------------ export excel --------------
router.route("/export-excel").get(exportExcel);
router.route("/import-excel").post(upload.single('file'),importExcel);
// ------------ export excel --------------

// ------------ sign in --------------
// router.route("/sign-in").post(signinHospital);
// ------------ sign in --------------

//---------- fetch all hospital details ---------
router.route("/getAllHospitalsDetails").get( getAllHospitalsDetails);
//---------- fetch all hospital details ---------

module.exports = router;
