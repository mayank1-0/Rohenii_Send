const router = require("express").Router();
const isAdmin = require('../middleware/isAdmin');

router.route("/").get((req, res) => {
    res.render("admin/signin");
});

router.route("/forgot-password").get((req, res) => {
    res.render("admin/forgotPassword");
});

router.route("/password/reset/:token").get((req, res) => {
    res.render("admin/resetPassword",{token:req.params.token});
});

router.route("/dashboard").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/index",
        {
            role: role,
            adminName: admin.name,
            adminEmail: admin.email,
            adminMobile: admin.mobile,
        }
    );
});

router.route("/update-password").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/update-password", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});
router.route("/update-profile").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/update-profile", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/hospital-request").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/Request/hospital-request", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/insurance-company-request").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/Request/insurance-company-request", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/tpa-request").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/Request/tpa-request", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/hospital-details").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/Details/hospital-details", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/insurance-co-details").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/Details/insurance-co-details", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/tpa-details").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/Details/tpa-details", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/hospital-exclude-request-by-insurance-company").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/Hospital_Exclude_Request/by-insurance-company", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/hospital-exclude-request-by-tpa").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/Hospital_Exclude_Request/by-tpa", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/hospital-unexclude-request-by-insurance-company").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/Hospital_Unexclude_Request/by-insurance-company", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/hospital-unexclude-request-by-tpa").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/Hospital_Unexclude_Request/by-tpa", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/subscriptions").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/subscriptions", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

router.route("/subadmin").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/subadmin", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});
router.route("/compose").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/email/compose", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});
router.route("/email-sent").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/email/email-sent", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});
router.route("/news").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/news", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});
router.route("/about-us").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/aboutUs", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});
router.route("/contact-us").get(isAdmin, (req, res) => {
    const admin = req.admin;
    const role = req.admin.role;
    res.render("admin/contactUs", {
        role: role,
        adminName: admin.name,
        adminEmail: admin.email,
        adminMobile: admin.mobile,
    });
});

module.exports = router