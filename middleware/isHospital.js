const ErrorHandler = require('./ErrorHandler')
const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const Hospital = require("../models/hospital");

const isHospital = asyncHandler(async (req, res, next) => {
    const { hospitaltoken } = req.cookies;
    if (!hospitaltoken) {
        return res.status(401).redirect('/');
    }
    const decodedData = await jwt.verify(hospitaltoken, process.env.JWT_SECRET);
    const findHospital = await Hospital.findById(decodedData.id);

    if (!findHospital) {
        return res.status(401).redirect('/')
    }
    req.hospital = findHospital;
    next();
});

module.exports = isHospital
