const express = require("express");
const router = express.Router();
const { getBlockchainStats } = require("../controllers/blockchainController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/blockchain-stats", protect, authorizeRoles("admin"), getBlockchainStats);

module.exports = router;
