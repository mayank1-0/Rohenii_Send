const mongoose = require('mongoose');

// Define a simple News Schema with just one field for the latest news
const newsSchema = new mongoose.Schema({
    news: {
        type: String,
        required: [true, 'News content is required'],
        trim: true,
        maxlength: [1000, 'News content cannot exceed 500 characters'],  // You can adjust this as needed
    }
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

// Export the News model
module.exports = mongoose.model('News1', newsSchema);
