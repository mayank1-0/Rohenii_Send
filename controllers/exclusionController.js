const Exclusion = require('../models/exclusion');
const Hospital = require('../models/hospital');
const TPA = require('../models/TPA');
const InsuranceCompany = require('../models/insuranceCompany');

// Create Exclusion
exports.createExclusion = async (req, res) => {
    try {
        const { hospitalId, excludedByTPAId, excludedByInsuranceCompanyId, membershipStatus, membershipBoughtDate, membershipRenewalDate } = req.body;

        // Check if hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Check if TPA exists if provided
        if (excludedByTPAId) {
            const tpa = await TPA.findById(excludedByTPAId);
            if (!tpa) {
                return res.status(404).json({ message: 'TPA not found' });
            }
        }

        // Check if Insurance Company exists if provided
        if (excludedByInsuranceCompanyId) {
            const insuranceCompany = await InsuranceCompany.findById(excludedByInsuranceCompanyId);
            if (!insuranceCompany) {
                return res.status(404).json({ message: 'Insurance Company not found' });
            }
        }

        // Create new exclusion record
        const exclusion = await Exclusion.create({
            hospitalId,
            excludedByTPAId,
            excludedByInsuranceCompanyId,
            membershipStatus,
            membershipBoughtDate,
            membershipRenewalDate
        });

        return res.status(201).json({
            message: 'Exclusion created successfully',
            exclusion
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get All Exclusions
exports.getAllExclusions = async (req, res) => {
    try {
        const { listType, name } = req.query;
        let exclusions;

        let filter ={membershipStatus: listType};

        // if(name){
        //     filter.name={ $regex: name, $options: 'i' }
        // }

        if (listType === 'Unpaid') {
            exclusions = await Exclusion.find(filter)
                .populate('hospitalId')
                .populate({
                    path: 'excludedByTPAId', // Populate the 'excludedByInsuranceCompanies' field
                    select: '_id nameId',  // Select relevant details of the insurance company
                    populate: {
                        path: 'nameId', // Populate the 'nameId' field which is a reference to InsuranceCompanyName model
                        select: 'name',  // Select relevant details from the InsuranceCompanyName model
                    }
                })
                .populate({
                    path: 'excludedByInsuranceCompanyId', // Populate the 'excludedByInsuranceCompanies' field
                    select: '_id nameId',  // Select relevant details of the insurance company
                    populate: {
                        path: 'nameId', // Populate the 'nameId' field which is a reference to InsuranceCompanyName model
                        select: 'name',  // Select relevant details from the InsuranceCompanyName model
                    }
                });
        }
        else {
            exclusions = await Exclusion.find(filter)
            .populate('hospitalId')
        }
        return res.status(200).json({
            success: true,
            count: exclusions.length,
            data: exclusions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get Single Exclusion by ID
exports.getExclusionById = async (req, res) => {
    try {
        const exclusion = await Exclusion.findById(req.params.id)
            .populate('hospitalId')
            .populate('excludedByTPAId')
            .populate('excludedByInsuranceCompanyId');

        if (!exclusion) {
            return res.status(404).json({ message: 'Exclusion not found' });
        }

        return res.status(200).json(exclusion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update Exclusion
exports.updateExclusionStatus = async (req, res) => {
    try {
        const { status, id } = req.params;

        // Validate the status
        const validStatuses = ['Paid', 'Unpaid', 'Renewal'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid membership status." });
        }

        // Check if the exclusion exists
        const exclusion = await Exclusion.findById(id);
        if (!exclusion) {
            return res.status(404).json({ message: 'Exclusion not found' });
        }

        if (status === 'Paid') {
            exclusion.membershipBoughtDate = Date.now();
            // Automatically set renewal date
            exclusion.membershipRenewalDate = new Date(exclusion.membershipBoughtDate);
            exclusion.membershipRenewalDate.setFullYear(exclusion.membershipRenewalDate.getFullYear() + 1);
            if (exclusion.excludedByInsuranceCompanyId) {
                let hospital = await Hospital.findById(exclusion.hospitalId._id);
                const indexInHospital = hospital.adminApprovedExcludedByInsuranceCompanies.indexOf(exclusion.excludedByInsuranceCompanyId._id);

                // Remove the insuranceCompanyID from the adminApprovedExcludedByInsuranceCompanies array
                hospital.adminApprovedExcludedByInsuranceCompanies.splice(indexInHospital, 1);
                await hospital.save();
            }
            else if (exclusion.excludedByTPAId) {
                let hospital = await Hospital.findById(exclusion.hospitalId._id);
                const indexInHospital = hospital.adminApprovedExcludedByTPAs.indexOf(exclusion.excludedByTPAId._id);

                // Remove the tpaId from the adminApprovedExcludedByTPAs array
                hospital.adminApprovedExcludedByTPAs.splice(indexInHospital, 1);
                await hospital.save();
            }
        } else if (status === 'Renewal') {
            // Set renewal date to one year from now, keep bought date unchanged
            exclusion.membershipRenewalDate = new Date();
            exclusion.membershipRenewalDate.setFullYear(exclusion.membershipRenewalDate.getFullYear() + 1);
            // Optional: You might want to set membershipBoughtDate to now as well
            exclusion.membershipBoughtDate = Date.now();
            if (exclusion.excludedByInsuranceCompanyId) {
                let hospital = await Hospital.findById(exclusion.hospitalId._id);
                const indexInHospital = hospital.adminApprovedExcludedByInsuranceCompanies.indexOf(exclusion.excludedByInsuranceCompanyId._id);

                // Remove the insuranceCompanyID from the adminApprovedExcludedByInsuranceCompanies array
                hospital.adminApprovedExcludedByInsuranceCompanies.splice(indexInHospital, 1);
                await hospital.save();
            }
            else if (exclusion.excludedByTPAId) {
                let hospital = await Hospital.findById(exclusion.hospitalId._id);
                const indexInHospital = hospital.adminApprovedExcludedByTPAs.indexOf(exclusion.excludedByTPAId._id);

                // Remove the tpaId from the adminApprovedExcludedByTPAs array
                hospital.adminApprovedExcludedByTPAs.splice(indexInHospital, 1);
                await hospital.save();
            }
        } else if (status === 'Unpaid') {
            // Clear dates if membership is unpaid
            exclusion.membershipBoughtDate = null;
            exclusion.membershipRenewalDate = null;
            if (exclusion.excludedByInsuranceCompanyId) {
                let hospital = await Hospital.findById(exclusion.hospitalId._id);
                if (hospital.excludedByInsuranceCompanies.includes(exclusion.excludedByInsuranceCompanyId._id)) {
                    hospital.adminApprovedExcludedByInsuranceCompanies.push(exclusion.excludedByInsuranceCompanyId._id);
                    await hospital.save();
                }
            }
            else if (exclusion.excludedByTPAId) {
                let hospital = await Hospital.findById(exclusion.hospitalId._id);
                if (hospital.excludedByTPAs.includes(exclusion.excludedByTPAId._id)) {
                    hospital.adminApprovedExcludedByTPAs.push(exclusion.excludedByTPAId._id);
                    await hospital.save();
                }
            }

        }

        exclusion.updatedAt = Date.now();

        // Update exclusion details
        exclusion.membershipStatus = status || exclusion.membershipStatus;

        // Save the updated exclusion
        await exclusion.save();

        return res.status(200).json({
            message: 'Exclusion updated successfully',
            exclusion
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Delete Exclusion
exports.deleteExclusion = async (req, res) => {
    try {
        const exclusion = await Exclusion.find(req.params.id);

        if (!exclusion) {
            return res.status(404).json({ message: 'Exclusion not found' });
        }

        // Delete the exclusion
        await exclusion.remove();

        return res.status(200).json({ message: 'Exclusion deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};





