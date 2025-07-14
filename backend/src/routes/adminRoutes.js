const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware"); 
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

module.exports = router;