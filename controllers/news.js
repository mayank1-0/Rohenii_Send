const asyncHandler = require("../middleware/asyncHandler");
const News = require("../models/news");

exports.getLatestNews = asyncHandler(async (req, res, next) => {
    const news = await News.findOne();  // Assuming there's only one latest news
    if (!news) {
        return res.status(404).json({ success: false, message: 'No news available' });
    }
    res.status(200).json({ success: true, latestNews: news.news });
});

exports.addLatestNews = asyncHandler(async (req, res, next) => {
    const { newsContent } = req.body;  // Get news content from request body

    if (!newsContent) {
        return res.status(400).json({
            success: false,
            message: "News content is required",
        });
    }

    // Check if a news article already exists
    let news = await News.findOne();

    if (news) {
        // If a news article already exists, update it
        news.news = newsContent;
        await news.save();
        return res.status(200).json({
            success: true,
            message: 'Latest news updated successfully.',
            data: news,
        });
    } else {
        // If no news exists, create a new one
        news = new News({ news: newsContent });
        await news.save();
        return res.status(201).json({
            success: true,
            message: 'Latest news created successfully.',
            data: news,
        });
    }
});
