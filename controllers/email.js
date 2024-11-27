const asyncHandler = require("../middleware/asyncHandler");
const Email = require("../models/email"); // Import the Email model
const Admin = require("../models/admin"); // Import the Admin model
const Hospital = require("../models/hospital");
const sendEmail = require("../middleware/sendMail") // Import the Hospital model
require('dotenv').config();


// Controller method to create and send email
exports.createAndSendEmail = asyncHandler(async (req, res, next) => {
    const { recipient_email, subject, body } = req.body;
    const hospital = await Hospital.findOne({ email: recipient_email });

    if (!hospital) {
        return res.status(404).json({ message: "Hospital not found with this email" });
    }

    const email = new Email({      // Store adminId
        recipientId: hospital._id, // Store recipientId
        adminId:req.admin._id,
        subject,                   // Use the provided subject
        body,                      // Use the provided body
        status: "Draft",           // Set status to "Draft" initially
    });

    // Save the email document
    await email.save();

    const emailInfo = await sendEmail({email:hospital.email  , message:email.body , subject:email.subject});


    email.status = "Sent";
    email.sentAt = Date.now();
    await email.save();

    res.status(200).json({
        success:true,
        message: "Email sent successfully",
        emailInfo: emailInfo,
        email: email,
    });
});

// Fetch sent emails
exports.fetchSentEmails = asyncHandler(async (req, res, next) => {
    const sentEmails = await Email.getSentEmails(); // Use the method to fetch sent emails
    res.status(200).json({ success: true, sentEmails: sentEmails });
});

exports.deleteSentEmail = asyncHandler(async (req, res, next) => {
    // Extract the email ID from req.params
    const { id } = req.params;

    // Find and delete the email by ID
    const deletedEmail = await Email.findByIdAndDelete(id);

    // If no email was found with the given ID
    if (!deletedEmail) {
        return res.status(404).json({ message: 'Email not found' });
    }

    // Return a success response with the deleted email's data
    res.status(200).json({
        message: 'Email successfully deleted',
        deletedEmail,
    });
});