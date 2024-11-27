const asyncHandler = require("../middleware/asyncHandler");
const ErrorHandler = require("../middleware/ErrorHandler");
const Hospital = require("../models/hospital");
const TPA = require("../models/TPA");
const InsuranceCompany = require("../models/insuranceCompany");
const TPANames = require("../models/tpaName");
const InsuranceCompanyNames = require("../models/insuranceCompanyName");
const PaginationAndFilter = require("../middleware/paginationAndFilter");
const mongoose = require("mongoose");

require('dotenv').config();

// ------------------ getAllHospitalsAndExcludedByData -------------------
exports.getAllHospitalsAndExcludedByData = asyncHandler(async (req, res, next) => {
    const hospital = await new PaginationAndFilter(Hospital);
    const hospitals = await hospital.getPaginatedAndFilteredResults(req.query);
    
    res.json(hospitals);
});
// ------------------ getAllHospitalsAndExcludedByData -------------------

// ---------------- getHospitalexcludedInsuranceAndTPA -------------
exports.getHospitalexcludedInsuranceAndTPA = asyncHandler(async (req, res, next) => {
    const hospitalId = req.params.hospitalId;

    const hospital = await Hospital.findById(hospitalId)
        .populate({
            path: 'adminApprovedExcludedByInsuranceCompanies',
            select: 'nameId',
            populate: {
                path: 'nameId', 
                select: 'name', 
            }
        })
        .populate({
            path: 'adminApprovedExcludedByTPAs',
            select: 'nameId', // Only select the name field
            populate: {
                path: 'nameId', // Populate the nameId field (which is a reference to TPA, if applicable)
                select: 'name', // Assuming TPAs have a name field, select that
            }
        });
            
    // Check if the hospital exists
    if (!hospital) {
        return res.status(404).json({
            success: false,
            message: "Hospital not found"
        });
    }    

    // Format the excludedByInsuranceCompanies and excludedByTPAs data to include names
    const excludedByInsuranceCompanies = hospital.adminApprovedExcludedByInsuranceCompanies.map(ins => ({
        name: ins.nameId.name // Extract the name from the populated InsuranceCompanyNames model
    }));

    const excludedByTPAs = hospital.adminApprovedExcludedByTPAs.map(tpa => ({
        name: tpa.nameId.name // Extract the name from the populated TPA model (if relevant)
    }));

    // Send the excluded insurances and TPAs in the response
    res.status(200).json({
        success: true,
        hospitalName: hospital.name,
        excludedByInsuranceCompanies,
        excludedByTPAs,
        message: "Excluded by insurance companies and by TPAs fetched successfully"
    });
});
// ---------------- getHospitalexcludedInsuranceAndTPA -------------

// -------------- fetch all hospitals ------------
exports.getAllHospitalsNameId = asyncHandler(async (req, res, next) => {
    const hospitals = await Hospital.find().select('name');
    res.status(200).json({
        success: true,
        hospitals,
        message: "Hospitals name and Id fetched successfully"
    });
});
// -------------- fetch all hospitals ------------

// -------------- get all TPANames names & ids -----------
exports.getAllTPANamesData = asyncHandler(async (req, res, next) => {
    const tpaNameNames = await TPANames.find().select('name');
    res.status(200).json({
        success: true,
        tpaNameNames,
        message: "TPANames name and Id fetched successfully"
    });
});
// -------------- get all TPANames names & ids -----------

// -------------- get all InsuranceCompaniesNames names & ids -----------
exports.getAllInsuranceCompanyNamesData = asyncHandler(async (req, res, next) => {
    const insuranceCompanyNames = await InsuranceCompanyNames.find().select('name');
    res.status(200).json({
        success: true,
        insuranceCompanyNames,
        message: "InsuranceCompanyNames name and Id fetched successfully"
    });
});
// -------------- get all InsuranceCompaniesNames names & ids -----------