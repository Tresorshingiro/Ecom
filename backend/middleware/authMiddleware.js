const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.SECRET)
            console.log('Decoded token:', decoded)

            // Get user from token
            const user = await User.findById(decoded._id).select('-password')
            if (!user) {
                res.status(401)
                throw new Error('User not found')
            }
            req.user = user
            req.user.isAdmin = decoded.isAdmin // Use the admin status from token
            console.log('User found:', req.user)

            next()
        } catch (error) {
            console.error('Token verification error:', error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

// Middleware to check if user is admin
const admin = (req, res, next) => {
    console.log('Checking admin status:', req.user)
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as admin')
    }
}

module.exports = { protect, admin }