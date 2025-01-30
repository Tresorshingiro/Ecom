const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({
            email: user.email,
            username: user.username,
            token,
            _id: user._id
        })
        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// signup user
const signupUser = async (req, res) => {
    const {username, email, password} = req.body
    
    try{
        const user = await User.signup(username, email, password)

        //create token
        const token = createToken(user._id)

        res.status(200).json({
            email,
            username: user.username,
            token
        })
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    loginUser,
    signupUser,
    getUserProfile
}