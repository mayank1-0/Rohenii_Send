const { signupHospital, getAllHospitalsDetails } = require("../controllers/hospital.js");
const router = require("express").Router()

// ------------ sign up --------------
router.route("/sign-up").post(signupHospital);
// ------------ sign up --------------

// ------------ sign in --------------
// router.route("/sign-in").post(signinHospital);
// ------------ sign in --------------

//---------- fetch all hospital details ---------
router.route("/getAllHospitalsDetails").get( getAllHospitalsDetails);
//---------- fetch all hospital details ---------

module.exports = router;
