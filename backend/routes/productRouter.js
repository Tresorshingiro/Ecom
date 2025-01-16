const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')

// Routes
router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', protect, admin, upload.array('images'), createProduct)
router.patch('/:id', protect, admin, upload.array('images'), updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

module.exports = router