const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware'); 


router.post('/', protect, productController.createProduct);


router.get('/my-products', protect, productController.myProducts);




router.get('/', productController.getAllProducts); 


router.get('/qr/:qrCode', productController.getProductByQR);
router.get('/verify/:qrCode', productController.verifyProduct);




router.get('/:id', productController.getProductById);
router.patch('/:id/status', protect, productController.updateProductStatus); 
router.patch('/scan/:qrCode', productController.incrementScanCount); 
router.post('/:qrCode/steps', protect, productController.addStepToProduct); 

module.exports = router;