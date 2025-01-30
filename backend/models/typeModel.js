const mongoose = require('mongoose')
const Schema = mongoose.Schema

const typeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Type', typeSchema)
