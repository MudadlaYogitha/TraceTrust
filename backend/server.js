const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Root Route
app.get("/", (req, res) => {
  res.send("🌐 Blockchain Product Traceability API");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
