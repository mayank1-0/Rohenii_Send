const AboutUs = require('../models/aboutUs');

// Create or update About Us content
exports.createOrUpdateAboutUs = async (req, res) => {
    try {
        // Check if About Us content already exists
        let aboutUs = await AboutUs.findOne();

        if (aboutUs) {
            // Update the existing About Us content
            aboutUs = Object.assign(aboutUs, req.body);
            await aboutUs.save();
        } else {
            // Create new About Us content
            aboutUs = new AboutUs(req.body);
            await aboutUs.save();
        }

        res.status(200).json({
            success: true,
            message: 'About Us content saved successfully',
            data: aboutUs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// Get About Us content
exports.getAboutUs = async (req, res) => {
    try {
        const aboutUs = await AboutUs.findOne();
        if (!aboutUs) {
            return res.status(404).json({
                success: false,
                message: 'About Us content not found',
            });
        }
        res.status(200).json({
            success: true,
            data: aboutUs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
