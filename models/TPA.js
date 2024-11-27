const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const tpaSchema = new mongoose.Schema({
    nameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TPAName', // Reference to the TPAName model
        required: [true, "Please Enter TPA Name"],
    },
    contactPerson: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
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
        type: Number,
        max: [9999999999, "Enter A valid contact number"],
        min: [1000000000, "Enter A valid contact number"],
        trim: true
    },
    department: {
        type: String,
        required: [true, "Please enter your department"],
        trim: true
    },
    designation: {
        type: String,
        // required: [true, "Please enter your designation"],
        trim: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    // otp: {
    //     type: String,
    //     required: true
    // },
    // otpExpiration: {
    //     type: Date,
    //     required: true
    // },
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

// tpaSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next();
//     }

//     this.password = await bcrypt.hash(this.password, 10);
// });

// Verification method
tpaSchema.methods.verifyAccount = function () {
    this.isVerified = 'Approve';
    this.verifiedAt = Date.now();
};

// UnVerification method
tpaSchema.methods.unVerifyAccount = function () {
    this.isVerified = 'Reject';
    this.verifiedAt = Date.now();
};

// JWT TOKEN
tpaSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });
};

// Compare Password
tpaSchema.methods.comparePassword = async function (password) {
    if( password === this.password ) {
        return true;
    }
    else {
        return false;
    }
    // return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
tpaSchema.methods.getResetPasswordToken = function () {
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

module.exports = new mongoose.model('TPA', tpaSchema);
