const express = require('express')
const { adminLogin } = require('../controllers/adminController')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')

// Admin login route
router.post('/login', adminLogin)

// Add this new route to check admin status
router.get('/check', protect, admin, (req, res) => {
    res.status(200).json({ 
        isAdmin: true,
        message: 'User is authorized as admin'
    })
})

module.exports = router 