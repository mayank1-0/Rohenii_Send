const router = require("express").Router();

// welcome urls
router.route("/").get((req,res)=>{
    res.render("welcome/index")
})

router.route("/about-us").get((req,res)=>{
    res.render("welcome/about-us")
})
router.route("/contact-us").get((req,res)=>{
    res.render("welcome/contact-us")
})

module.exports = router