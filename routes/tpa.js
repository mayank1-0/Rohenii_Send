const { signupTPA, signinTPA, excludeHospital, unExcludeHospital, logout, changePassword } = require("../controllers/tpa");
const router = require("express").Router();
const isTPA = require('../middleware/isTPA');

router.route("/logout").get(isTPA, logout);
router.route("/change-password").post(isTPA, changePassword);

// ------------ sign up --------------
router.route("/sign-up").post(signupTPA);
// ------------ sign up --------------

// ------------ sign in --------------
router.route("/sign-in").post(signinTPA);
// ------------ sign in --------------

// ------------ exclude hospital --------------
router.route("/exclude-hospital/:id").post(isTPA, excludeHospital);
// ------------ exclude hospital --------------

// ------------ un-exclude hospital --------------
// router.route("/un-exclude-hospital/:id").put(isTPA, unExcludeHospital);
// ------------ un-exclude hospital --------------

module.exports = router;
