const router = require("express").Router();
const isInsuranceCompany = require('../middleware/isInsuranceCompany');

router.route("/dashboard").get(isInsuranceCompany, (req,res)=>{
    const insuranceCompany = req.insuranceCompany;
    res.render("InsuranceCompany/insurance-company-dashboard", {
        insuranceCompanyName: insuranceCompany.nameId.name,
        insuranceCompanyContactPerson: insuranceCompany.contactPerson,
        insuranceCompanyEmail: insuranceCompany.email,
        insuranceCompanyContactNumber: insuranceCompany.contactNumber
    });
});

router.route("/update-password").get(isInsuranceCompany, (req,res)=>{
    const insuranceCompany = req.insuranceCompany;
    res.render("InsuranceCompany/update-password", {
        insuranceCompanyName: insuranceCompany.nameId.name
    });
});

module.exports = router