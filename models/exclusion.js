const mongoose = require('mongoose');

const exclusionSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital', // Reference to the Hospital model
        required: true,
    },
    excludedByTPAId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TPA', // Reference to the TPA model
        required: false, // Optional, will be filled if exclusion is by TPA
    },
    excludedByInsuranceCompanyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InsuranceCompany', // Reference to the InsuranceCompany model
        required: false, // Optional, will be filled if exclusion is by Insurance Company
    },
    membershipStatus: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Renewal'],
        required: true, // Membership status of the hospital
        default: 'Unpaid'
    },
    membershipBoughtDate: {
        type: Date,
        required: function () {
            return this.membershipStatus === 'Paid'; // Only required if membershipStatus is "Paid"
        },
        default: null
    },
    membershipRenewalDate: {
        type: Date,
        required: function () {
            return this.membershipStatus === 'Paid'; // Only required if membershipStatus is "Paid"
        },
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Exclusion', exclusionSchema);
