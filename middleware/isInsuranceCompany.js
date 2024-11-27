const ErrorHandler = require('./ErrorHandler')
const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const InsuranceCompany = require("../models/insuranceCompany");

const isInsuranceCompany = asyncHandler(async (req, res, next) => {

    const { insuranceCompanytoken } = req.cookies;
    if (!insuranceCompanytoken) {
        return res.status(401).redirect('/');
    }
    const decodedData = await jwt.verify(insuranceCompanytoken, process.env.JWT_SECRET);
    const findInsuranceCompany = await InsuranceCompany.findById(decodedData.id).populate({
        path: 'nameId',
        select: 'name'
    });;

    if (!findInsuranceCompany) {
        return res.status(401).redirect('/')
    }
    req.insuranceCompany = findInsuranceCompany;
    next();
});

module.exports = isInsuranceCompany
