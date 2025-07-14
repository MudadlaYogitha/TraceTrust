const Product = require("../models/Product"); 

const createProduct = async (req, res, next) => {
  try {
    const { name, description, qrCode, category, manufacturer, batchNumber } =
      req.body;

    
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({
          message: "Unauthorized: User not authenticated or ID missing.",
        });
    }
    const createdBy = req.user._id;

    if (!name || !description || !qrCode) {
      return res
        .status(400)
        .json({ message: "Name, description, and QR code are required." });
    }

    const existing = await Product.findOne({ qrCode });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Product with this QR code already exists." });
    }


    
    const product = await Product.create({
      name,
      description,
      qrCode,
      category,
      manufacturer,
      batchNumber,
      createdBy: createdBy, 
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Create product failed:", error);
    next(error);
  }
};


const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    next(error);
  }
};


const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Fetch product by ID failed:", err);
    next(err);
  }
};


const getProductByQR = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { qrCode: req.params.qrCode },
      { $inc: { scannedCount: 1 } }, 
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Failed to fetch and increment scan count:", err);
    next(err);
  }
};



const updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Update product status failed:", err);
    next(err);
  }
};


const incrementScanCount = async (req, res, next) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { qrCode: req.params.qrCode },
      { $inc: { scanCount: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Increment scan count failed:", err);
    next(err);
  }
};


const addStepToProduct = async (req, res, next) => {
  try {
    const { stepType, description, location, certification, metadata } =
      req.body;
    const qrCode = req.params.qrCode;

    const product = await Product.findOne({ qrCode });
    if (!product) return res.status(404).json({ message: "Product not found" });


    const newStep = {
      stepType,
      description,
      location,
      certification: certification || "",
      metadata: metadata || {},
      timestamp: new Date(),
    };

    product.steps.push(newStep);
    await product.save();

    res.status(201).json(newStep);
  } catch (err) {
    console.error("❌ Add step failed:", err);
    next(err);
  }
};


const verifyProduct = async (req, res, next) => {
  try {
    const { qrCode } = req.params;
    const product = await Product.findOne({ qrCode });
    if (!product)
      return res.status(404).json({ message: "Product not found locally" });


    res.json({ authentic: isAuthentic });
  } catch (error) {
    console.error("❌ Verify product error:", error);
    next(error);
  }
};


const myProducts = async (req, res) => {
  try {
    
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing from token." });
    }
    
    const userId = req.user._id;
    const products = await Product.find({ createdBy: userId }).sort({ createdAt: -1 });;
    res.json(products);
  } catch (error) {
    console.error("❌ Fetch my products failed:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByQR,
  updateProductStatus,
  incrementScanCount,
  addStepToProduct,
  verifyProduct,
  myProducts,
};