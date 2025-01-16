require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/userModel')

async function makeAdmin() {
    try {
        await mongoose.connect(process.env.MONG_URI)
        
        // Replace with the email of the user you want to make admin
        const userEmail = 't.nkurunziz@alustudent.com'
        
        const user = await User.findOneAndUpdate(
            { email: userEmail },
            { isAdmin: true },
            { new: true }
        )
        
        if (user) {
            console.log('User updated successfully:', user)
        } else {
            console.log('User not found')
        }
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await mongoose.connection.close()
    }
}

makeAdmin() 