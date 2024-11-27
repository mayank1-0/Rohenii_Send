const ErrorHandler = require('./ErrorHandler')
const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const Admin = require("../models/admin");

const isAdmin = asyncHandler(async (req, res, next) => {
  const { admntoken } = req.cookies;
  
  if (!admntoken) {
    return res.status(401).redirect('/admin/');
  }
  const decodedData = await jwt.verify(admntoken, process.env.JWT_SECRET);
  const findAdmin = await Admin.findById(decodedData.id);

  if (!findAdmin) {
    return res.status(401).redirect('/admin/')
  }
  req.admin = findAdmin;
  next();
});

module.exports = isAdmin

