// models/AboutUs.js
const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema({
    heading1: {
        type: String,
        required: [true, "Please enter the first heading"],
    },
    paragraph1: {
        type: String,
        required: [true, "Please enter the first paragraph"],
    },
    heading2: {
        type: String,
    },
    paragraph2: {
        type: String,
    },
    heading3: {
        type: String,
    },
    paragraph3: {
        type: String,
    },
    heading4: {
        type: String,
    },
    paragraph4: {
        type: String,
    },
    heading5: {
        type: String,
    },
    paragraph5: {
        type: String,
    },
    heading6: {
        type: String,
    },
    paragraph6: {
        type: String,
    },
    heading7: {
        type: String,
    },
    paragraph7: {
        type: String,
    },
    heading8: {
        type: String,
    },
    paragraph8: {
        type: String,
    },
    heading9: {
        type: String,
    },
    paragraph9: {
        type: String,
    },
    heading10: {
        type: String,
    },
    paragraph10: {
        type: String,
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('AboutUs', aboutUsSchema);
