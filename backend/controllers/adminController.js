const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id, isAdmin: true}, process.env.SECRET, {expiresIn: '3d'})
}

const adminLogin = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)
        
        if (!user.isAdmin) {
            console.log('Not authorized as admin')
            throw Error('Not authorized as admin')
        }

        const token = createToken(user._id)
        res.status(200).json({email, token, isAdmin: user.isAdmin})
    } catch (error) {
        console.log('Login error', error.message)
        res.status(400).json({error: error.message})
    }
}

module.exports = { adminLogin } 