// models/InsuranceCompanyName.js
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const tpaNameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the TPA Name"],
        trim: true,
        unique: [true, "TPA name must be unique"]
    },
    email: {
        type: String,
        required: [true, "Please Enter TPA's Email"],
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
        required: [true, "Please Enter TPA Address"],
        trim: true
    }
}, {
    timestamps: true
});

tpaNameSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
tpaNameSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });
};

tpaNameSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('TPAName', tpaNameSchema);
