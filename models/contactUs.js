// models/ContactUs.js
const mongoose = require("mongoose");
const validator = require("validator");

const contactUsSchema = new mongoose.Schema({
    address: {
        type: String,
        required: [true, "Please enter the address"],  // Make sure the address is required
    },
    email: {
        type: String,
        required: [true, "Please enter the email"], // Make sure email is required
        validate: [validator.isEmail, "Please Enter a valid Email"],
        trim: true,
    },
    contactNumber: {
        type: String,
        required: [true, "Please enter the contact number"], // Contact number is required
        max: [9999999999, "Enter A valid contact number"],
        min: [1000000000, "Enter A valid contact number"],
        trim: true
    },
    landlineNumber: {
        type: String,
        required: false, // Landline is optional
        max: [99999999, "Enter A valid landline number"],
        min: [10000000, "Enter A valid landline number"],
        trim: true
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('ContactUs', contactUsSchema);
