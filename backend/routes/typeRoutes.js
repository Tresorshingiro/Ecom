const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')
const { 
    createType,
    getAllTypes,
    getTypeById,
    updateTypeById,
    deleteTypeById
} = require('../controllers/typeController')

// Routes
router.post('/', protect, admin, createType)
router.get('/', getAllTypes)
router.get('/:id', getTypeById)
router.put('/:id', protect, admin, updateTypeById)
router.delete('/:id', protect, admin, deleteTypeById)

module.exports = router
