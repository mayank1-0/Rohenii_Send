const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ExcelJS = require("exceljs");

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Hospital Name"],
        trim: true,
        unique: true
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
        type: String, // Changed to String to accommodate various formats
        required: [true, "Please Enter Contact Number"],
        validate: {
            validator: (v) => /\d{10}/.test(v),
            message: "Enter a valid contact number"
        }
    },
    address: {
        type: String,
        required: [true, "Please Enter Hospital Address"],
        trim: true
    },
    district: {
        type: String,
        required: [true, "Please Enter Hospital's District"],
        trim: true
    },
    pincode: {
        type: String,
        required: [true, "Please Enter Hospital's Pincode"],
        trim: true
    },
    state: {
        type: String,
        required: [true, "Please Enter Hospital's State"],
        trim: true
    },
    policies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy' // Reference to the Policy schema
    }],
    excludedByTPAs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TPA'
    }], // Array of TPA ObjectIDs
    excludedByInsuranceCompanies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InsuranceCompany'
    }], // Array of Insurance ObjectIDs
    adminApprovedExcludedByTPAs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TPA'
    }], // Array of TPA ObjectIDs
    adminApprovedExcludedByInsuranceCompanies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InsuranceCompany'
    }], // Array of Insurance ObjectIDs
    membershipStatus: {
        type: String,
        required: true,
        default: 'Unpaid',
        enum: ['Paid', 'Unpaid', 'Renewal']
    },
    membershipBoughtDate: {
        type: Date,
        required: function () { return this.membershipStatus === 'Paid'; },
        default: null,
    },
    membershipRenewalDate: {
        type: Date,
        default: null,
    },
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
    }
}, {
    timestamps: true
});

hospitalSchema.pre("save", async function (next) {
    if (this.isModified("membershipBoughtDate") && this.membershipBoughtDate) {
        this.membershipRenewalDate = new Date(this.membershipBoughtDate);
        this.membershipRenewalDate.setFullYear(this.membershipRenewalDate.getFullYear() + 1);
    }
    next();
});


// Verification method
hospitalSchema.methods.verifyAccount = function () {
    this.isVerified = 'Approve';
    this.verifiedAt = Date.now();
};

// UnVerification method
hospitalSchema.methods.unVerifyAccount = function () {
    this.isVerified = 'Reject';
    this.verifiedAt = Date.now();
};

// JWT TOKEN
hospitalSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });
};

// Compare Password
// hospitalSchema.methods.comparePassword = async function (password) {
//     return await bcrypt.compare(password, this.password);
// };

// Generating Password Reset Token
hospitalSchema.methods.getResetPasswordToken = function () {
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

hospitalSchema.statics.exportToExcel = async function () {
    // Get all hospitals from the database
    const hospitals = await this.find();

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Hospitals");

    // Define columns for the worksheet
    worksheet.columns = [
        { header: "Name", key: "name", width: 30 },
        { header: "Contact Person", key: "contactPerson", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Contact Number", key: "contactNumber", width: 20 },
        { header: "Address", key: "address", width: 40 },
        { header: "District", key: "district", width: 20 },
        { header: "Pincode", key: "pincode", width: 15 },
        { header: "State", key: "state", width: 20 },
        { header: "Membership Status", key: "membershipStatus", width: 20 },
        { header: "Created At", key: "createdAt", width: 20 },
        { header: "Is Verified", key: "isVerified", width: 15 },
        { header: "Verified At", key: "verifiedAt", width: 20 },
    ];

    // Add data rows for each hospital
    hospitals.forEach((hospital) => {
        worksheet.addRow({
            name: hospital.name,
            contactPerson: hospital.contactPerson,
            email: hospital.email,
            contactNumber: hospital.contactNumber,
            address: hospital.address,
            district: hospital.district,
            pincode: hospital.pincode,
            state: hospital.state,
            membershipStatus: hospital.membershipStatus,
            createdAt: hospital.createdAt,
            isVerified: hospital.isVerified,
            verifiedAt: hospital.verifiedAt,
        });
    });

    return workbook;
};

hospitalSchema.statics.importFromExcel = async function (filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
  
    const worksheet = workbook.getWorksheet(1); // Get the first worksheet
    const hospitals = [];
  
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip the header row
        const hospitalData = {
          name: row.getCell(1).value,
          contactPerson: row.getCell(2).value,
          email: row.getCell(3).value,
          contactNumber: row.getCell(4).value,
          address: row.getCell(5).value,
          district: row.getCell(6).value,
          pincode: row.getCell(7).value,
          state: row.getCell(8).value,
          membershipStatus: row.getCell(9).value,
          createdAt: row.getCell(10).value,
          isVerified: row.getCell(11).value,
          verifiedAt: row.getCell(12).value,
        };
  
        hospitals.push(hospitalData);
      }
    });
  
    // Insert hospitals into the database
    await this.insertMany(hospitals);
  };

module.exports = mongoose.model('Hospital', hospitalSchema);
