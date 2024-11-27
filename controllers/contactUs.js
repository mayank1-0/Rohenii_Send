const ContactUs = require('../models/contactUs');

// Controller for creating or updating the Contact Us details
exports.createOrUpdateContactUsDetails = async (req, res) => {
    try {
        // Check if the contact details already exist in the database (if any)
        let contactUs = await ContactUs.findOne();  // Assuming only one contact document exists

        if (contactUs) {
            // If the document exists, update it with new data
            contactUs.address = req.body.address;
            contactUs.email = req.body.email;
            contactUs.contactNumber = req.body.contactNumber;
            contactUs.landlineNumber = req.body.landlineNumber || ''; // Optional field

            // Save the updated document
            await contactUs.save();
            return res.status(200).json({ message: 'Contact Us details updated successfully!', contactUs });
        } else {
            // If no document exists, create a new ContactUs document
            contactUs = new ContactUs({
                address: req.body.address,
                email: req.body.email,
                contactNumber: req.body.contactNumber,
                landlineNumber: req.body.landlineNumber || '',  // Optional field
            });

            // Save the new document
            await contactUs.save();
            return res.status(201).json({ success: true, message: 'Contact Us details created successfully!', contactUs });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error: Unable to create or update Contact Us details', error: error.message });
    }
};

// Controller for getting the Contact Us details
exports.getContactUsDetails = async (req, res) => {
    try {
        // Fetch the ContactUs document from the database
        const contactUs = await ContactUs.findOne(); // Assuming only one document exists

        if (!contactUs) {
            return res.status(404).json({ success: false, message: 'Contact Us details not found' });
        }

        return res.status(200).json({ success: true, contactUs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error: Unable to fetch Contact Us details', error: error.message });
    }
};
