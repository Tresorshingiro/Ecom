const mongoose = require('mongoose')

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Type', typeSchema)
