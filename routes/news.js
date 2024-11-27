const { getLatestNews, addLatestNews } = require("../controllers/news");
const router = require("express").Router();
const isAdmin = require('../middleware/isAdmin');

//---------- get latest news ---------
router.route("/get-latest-news").get(getLatestNews);
//---------- get latest news ---------

//---------- add latest news ---------
router.route("/add-latest-news").post(isAdmin, addLatestNews);
//---------- add latest news ---------


module.exports = router;
