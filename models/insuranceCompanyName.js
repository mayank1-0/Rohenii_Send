// models/InsuranceCompanyName.js
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const insuranceCompanyNameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the Insurance Company Name"],
        trim: true,
        unique: [true, "Insurance Company name must be unique"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Company's Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
        trim: true
    },
    address: {
        type: String,
        required: [true, "Please Enter Company Address"],
        trim: true
    },
    establishedYear: {
        type: Number,
        // required: [true, "Please Enter Established Year"],
        min: [1900, "Established Year must be after 1900"],
        max: [new Date().getFullYear(), "Established Year cannot be in the future"]
    }
}, {
    timestamps: true
});

insuranceCompanyNameSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
insuranceCompanyNameSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });
};

insuranceCompanyNameSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('InsuranceCompanyName', insuranceCompanyNameSchema);
