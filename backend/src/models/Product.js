const mongoose = require("mongoose");

const TraceabilityStepSchema = new mongoose.Schema(
  {
    stepType: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    certification: { type: String }, 
    metadata: { type: Object, default: {} }, 
    timestamp: { type: Date, default: Date.now },
    
    blockchainTxHash: { type: String }, 
    blockNumber: { type: Number }, 
    gasUsed: { type: Number }, 
    network: { type: String }, 
  },
  { _id: true } 
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String }, 
    manufacturer: { type: String }, 
    batchNumber: { type: String }, 
    qrCode: { type: String, required: true, unique: true, trim: true },
    scannedCount: { type: Number, default: 0 }, 
    steps: [TraceabilityStepSchema], 
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true, 
    },
    status: {
      type: String,
      enum: ["active", "completed", "recalled"],
      default: "active",
      required: true,
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Product", ProductSchema);