const express = require('express');
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
} = require('../controllers/categoryController');

const router = express.Router();

// Create a new category
router.post('/', createCategory);

// Get all categories
router.get('/', getAllCategories);

// Get a category by ID
router.get('/:id', getCategoryById);

// Update a category by ID
router.patch('/:id', updateCategoryById);

// Delete a category by ID
router.delete('/:id', deleteCategoryById);

module.exports = router;
