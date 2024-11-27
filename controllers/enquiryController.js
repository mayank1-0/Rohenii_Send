const Enquiry = require('../models/enquiry'); // Import the Mongoose model
const sendMail = require('../middleware/sendMail');
require("dotenv").config();

// Controller function to create a new contact entry
exports.createEnquiry = async (req, res) => {
    try {
        // Extract data from the request body
        const { firstname, lastname, email, contactNumber, city, state, zip } = req.body;

        // Create a new instance of the model with the provided data
        const newEnquiry = new Enquiry({
            firstname,
            lastname,
            email,
            contactNumber,
            city,
            state,
            zip
        });

        await newEnquiry.save();
        const bodytemplate=`<div>
        <h1>Enquiry</h1>
        <p>firstname : ${firstname}</p>
        <p>lastname : ${lastname}</p>
        <p>email : ${email}</p>
        <p>contactNumber : ${contactNumber}</p>
        <p>city : ${city}</p>
        <p>state : ${state}</p>
        <p>zip : ${zip}</p>
      </div>`

        await sendMail({email:process.env.RECIEVED_MAIL  , message:bodytemplate , subject:"You have New Enquiry"});      // Send a success response
        res.status(201).json({
            message: 'Enquiry entry created successfully!',
            enquiry: newEnquiry
        });
    } catch (error) {
        // Handle any errors that occur during the save process
        console.error(error);
        res.status(500).json({
            message: 'Error creating enquiry entry',
            error: error.message
        });
    }
};