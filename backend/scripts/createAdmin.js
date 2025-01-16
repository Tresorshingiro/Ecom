require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/userModel')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONG_URI)
        console.log('Connected to database')

        // Get admin details
        const email = await new Promise(resolve => {
            rl.question('Enter admin email: ', resolve)
        })

        const password = await new Promise(resolve => {
            rl.question('Enter admin password: ', resolve)
        })

        // Validate input
        if (!email || !password) {
            throw new Error('Email and password are required')
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email })
        if (existingAdmin) {
            throw new Error('Admin user already exists')
        }

        // Create admin user
        const user = await User.signup(email, password)
        
        // Set admin flag
        user.isAdmin = true
        await user.save()

        console.log('Admin user created successfully:', {
            email: user.email,
            isAdmin: user.isAdmin
        })

    } catch (error) {
        console.error('Error creating admin:', error.message)
    } finally {
        rl.close()
        mongoose.connection.close()
        process.exit()
    }
}

createAdmin()
