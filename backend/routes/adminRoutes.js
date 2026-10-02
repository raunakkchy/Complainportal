const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/adminController");

router.get("/stats", auth("admin"), c.stats);
router.get("/complaints", auth("admin"), c.all);
router.patch("/status/:id", auth("admin"), c.updateStatus);
router.post("/reply/:id", auth("admin"), c.reply);

module.exports = router;