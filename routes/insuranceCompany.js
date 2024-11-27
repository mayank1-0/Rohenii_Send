const { signupInsuranceCompany, signinInsuranceCompany, excludeHospital, unExcludeHospital, logout, changePassword } = require("../controllers/insuranceCompany");
const router = require("express").Router()
const isInsuranceCompany = require('../middleware/isInsuranceCompany');

router.route("/logout").get(isInsuranceCompany, logout);

router.route("/change-password").post(isInsuranceCompany, changePassword);

// ------------ sign up --------------
router.route("/sign-up").post(signupInsuranceCompany);
// ------------ sign up --------------

// ------------ sign in --------------
router.route("/sign-in").post(signinInsuranceCompany);
// ------------ sign in --------------

// ------------ exclude hospital --------------
router.route("/exclude-hospital/:id").post(isInsuranceCompany, excludeHospital);
// ------------ exclude hospital --------------

// ------------ un-exclude hospital --------------
// router.route("/unexclude-hospital/:id").put(isInsuranceCompany, unExcludeHospital);
// ------------ un-exclude hospital --------------

module.exports = router;
