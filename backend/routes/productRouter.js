const express = require('express')
const router = express.Router()
const { 
    getProducts, 
    getProduct, 
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    checkStock
} = require('../controllers/productController')
const { protect, admin } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

// Public routes
router.get('/', getProducts)
router.get('/:id', getProduct)

// Protected admin routes
router.post('/', protect, admin, upload.array('images'), createProduct)
router.patch('/:id', protect, admin, upload.array('images'), updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

// Stock management routes
router.post('/:id/check-stock', checkStock)
router.post('/:id/update-stock', protect, updateStock)

module.exports = router