// controllers/adminController.js
const Product = require("../models/Product"); 

const getAdminStats = async (req, res, next) => { 
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing from token." });
    }

    const userId = req.user._id;
    const totalProducts = await Product.countDocuments({ createdBy: userId });

    const totalScansResult = await Product.aggregate([
      { $match: { createdBy: userId } }, 
      { $group: { _id: null, totalScans: { $sum: "$scannedCount" } } },
    ]);
    const totalScans = totalScansResult.length > 0 ? totalScansResult[0].totalScans : 0;

    const totalStepsResult = await Product.aggregate([
      { $match: { createdBy: userId } },
      {
        $project: {
          _id: 0,
          numSteps: { $size: "$steps" }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$numSteps" }
        }
      }
    ]);
    const totalSteps = totalStepsResult.length > 0 ? totalStepsResult[0].total : 0;

    const activeProducts = await Product.countDocuments({ createdBy: userId, status: 'active' });

   
    const recentProducts = await Product.find({ createdBy: userId }) 
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt steps.stepType steps.timestamp'); 

    let recentActivity = [];
    for (const product of recentProducts) {
      recentActivity.push({
        action: 'CREATE_PRODUCT',
        details: `New product "${product.name}" created.`,
        timestamp: product.createdAt,
      });
      const recentSteps = product.steps.slice(-2).reverse(); 
      for (const step of recentSteps) {
        recentActivity.push({
          action: 'ADD_STEP',
          details: `Step "${step.stepType}" added to product "${product.name}".`,
          timestamp: step.timestamp,
        });
      }
    }

    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    recentActivity = recentActivity.slice(0, 10); 

    res.json({
      totalProducts,
      totalSteps,
      totalScans,
      activeProducts,
      recentActivity,
    });
  } catch (err) {
    console.error("❌ Fetch admin stats failed:", err); 
    res
      .status(500)
      .json({ message: "Server error while fetching admin stats" }); 
  }
};

module.exports = { getAdminStats };