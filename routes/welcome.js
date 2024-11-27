const { getAllHospitalsAndExcludedByData, getHospitalexcludedInsuranceAndTPA, getAllTPANamesData, getAllInsuranceCompanyNamesData } = require("../controllers/welcome.js");
const router = require("express").Router()

//---------- fetch all Hospitals along with excluded by data ---------
router.route("/getAllHospitalsAndExcludedByData").get(getAllHospitalsAndExcludedByData);
//---------- fetch all Hospitals along with excluded by data ---------

// -------- fetch excluded Ins. Comp. and TPA of a given hospital ------------
router.route("/excludedByInsuranceAndTPA/:hospitalId").get(getHospitalexcludedInsuranceAndTPA);
// -------- fetch excluded Ins. Comp. and TPA of a given hospital ------------

// ----------- get all TPANames -------------- 
router.route("/getAllTPANamesIds").get(getAllTPANamesData);
// ----------- get all TPANames --------------

// ----------- get all InsuranceCompanyNames -----------
router.route("/getAllInsuranceCompanyNamesIds").get(getAllInsuranceCompanyNamesData);
// ----------- get all InsuranceCompanyNames -----------

module.exports = router;