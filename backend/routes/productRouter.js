const express = require('express')
const upload = require('../middleware/uploadMiddleware')
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
} = require('../controllers/productController')

const router = express.Router()

//GET all Products
router.get('/', getAllProducts)

//GET single Product
router.get('/:id', getProductById)

//Post a new Product
router.post('/', upload.single('image'), createProduct)

//Update Product
router.patch('/:id', upload.single('image'), updateProductById)

//Delete a Product
router.delete('/:id', deleteProductById)


module.exports = router