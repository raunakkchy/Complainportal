const router = require("express").Router();
const c = require("../controllers/authController");

router.post("/student/register", c.registerStudent);
router.post("/student/login", c.loginStudent);
router.post("/admin/login", c.loginAdmin);

module.exports = router;