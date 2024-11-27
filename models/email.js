const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const emailSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Reference to Admin model
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital', // Reference to Admin model
        required: true
    },
    subject: {
        type: String,
        required: [true, "Email subject is required"],
        trim: true
    },
    body: {
        type: String,
        required: [true, "Email body is required"]
    },
    status: {
        type: String,
        required: true,
        enum: ['Sent', 'Failed', 'Draft'],
        default: 'Draft'
    },
    sentAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

emailSchema.pre('save', function (next) {
    if (this.status === 'Sent' && !this.sentAt) {
        this.sentAt = Date.now();
    }
    next();
});

// Model method to send an email
emailSchema.methods.sendEmail = async function (adminEmail, hospitalEmail) {
    // Use the email addresses passed as arguments to send the email
    const transporter = nodemailer.createTransport({
        service: "gmail", // You can configure this to use other SMTP services
        auth: {
            user: adminEmail, // Use the admin's email address to send
            pass: process.env.EMAIL_PASS, // App-specific password or regular password for admin email
        },
    });

    const mailOptions = {
        from: adminEmail, // Sender address (Admin's email)
        to: hospitalEmail, // Recipient address (Hospital's email)
        subject: this.subject,
        text: this.body,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

        // Mark the email as sent and update the sentAt field
        this.status = 'Sent';
        this.sentAt = Date.now();
        await this.save(); // Save the updated email record to the database

        return info; // Return email send result
    } catch (error) {
        // If email sending fails, mark the status as Failed
        this.status = 'Failed';
        await this.save(); // Save the email with a failed status

        throw new Error("Error sending email: " + error.message);
    }
};

// Static method to get all sent emails
emailSchema.statics.getSentEmails = async function () {
    try {
        // Fetch all emails with status 'Sent', ordered by sentAt
        const sentEmails = await this.find({ status: 'Sent' })
            .sort({ sentAt: -1 }) // Sort in descending order of sentAt
            .populate('recipientId', 'name')
            .exec();
        return sentEmails;
    } catch (error) {
        throw new Error('Error fetching sent emails: ' + error.message);
    }
};



module.exports = mongoose.model('Email', emailSchema);
