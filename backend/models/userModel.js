const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

//static signup method
userSchema.statics.signup = async function(username, email, password) {
    // validation
    if(!username || !email || !password) {
        throw Error('All fields must be filled')
    }
    if(username.length < 3) {
        throw Error('Username must be at least 3 characters long')
    }
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }

    const exists = await this.findOne({email})
    const usernameExists = await this.findOne({username})

    if(exists) {
        throw Error('Email already exists')
    }
    if(usernameExists) {
        throw Error('Username already taken')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ username, email, password: hash})

    return user
}

//staic login method
userSchema.statics.login = async function(email, password) {

   if(!email || !password){
    throw Error('All fields must be filled')
   } 

   const user = await this.findOne({ email })

   if(!user) {
    throw Error('Incorrect Email')
   }

   const match = await bcrypt.compare(password, user.password)
   
   if(!match) {
    throw Error('Incorrect password')
   }

   return user
}

module.exports = mongoose.model('User', userSchema)