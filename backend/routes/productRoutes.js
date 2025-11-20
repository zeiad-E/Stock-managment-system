const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const productController = require('../controllers/productController');

router.use(verifyToken);

router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);


module.exports = router;