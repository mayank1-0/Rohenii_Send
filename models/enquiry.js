const mongoose = require("mongoose");
const validator = require("validator");

const enquirySchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please enter the address"], 
    },
    lastname: {
        type: String,
        required: [true, "Please enter the address"],  
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
    city: {
        type: String,
        required: false, 
        trim: true
    },
    state: {
        type: String,
        required: false, 
        trim: true
    },
    zip: {
        type: String,
        required: false, 
        trim: true
    },
}, {
    timestamps: true 
});

module.exports = mongoose.model('enquiry', enquirySchema);
