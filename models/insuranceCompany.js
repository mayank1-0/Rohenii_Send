const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const insuranceCompanySchema = new mongoose.Schema({
    nameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InsuranceCompanyName', // Reference to the InsuranceCompanyName model
        required: [true, "Please Enter Insurance Company Name"],
    },
    contactPerson: {
        type: String,
        required: [true, "Please Enter Contact Person Name"],
        trim: true,
        maxLength: [50, "Contact Person Name cannot exceed 50 characters"],
        minLength: [4, "Contact Person Name should have more than 4 characters"]
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
    contactNumber: {
        type: String, // Changed to String to accommodate various formats
        required: [true, "Please Enter Contact Number"],
        validate: {
            validator: (v) => /\d{10}/.test(v),
            message: "Enter a valid contact number"
        }
    },
    address: {
        type: String,
        required: [true, "Please Enter Company Address"],
        trim: true
    },
    excludedHospitals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    }], // Array of Hospital ObjectIDs
    adminApprovedExcludedHospitals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    }], // Array of Hospital ObjectIDs
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    isVerified: {
        type: String,
        enum: ['Approve', 'Request', 'Reject'],
        default: 'Request', // Default to false when the account is created
    },
    verifiedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true
});

// insuranceCompanySchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next();
//     }

//     this.password = await bcrypt.hash(this.password, 10);
// });

// Verification method
insuranceCompanySchema.methods.verifyAccount = function () {
    this.isVerified = 'Approve';
    this.verifiedAt = Date.now();
};

// UnVerification method
insuranceCompanySchema.methods.unVerifyAccount = function () {
    this.isVerified = 'Reject';
    this.verifiedAt = Date.now();
};

// JWT TOKEN
insuranceCompanySchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });
};

// Compare Password
insuranceCompanySchema.methods.comparePassword = async function (password) {
    if( password === this.password ) {
        return true;
    }
    else {
        return false;
    }
    // return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
insuranceCompanySchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to adminSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('InsuranceCompany', insuranceCompanySchema);
