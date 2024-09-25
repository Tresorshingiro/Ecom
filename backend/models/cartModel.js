const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CartSchema = new Schema({
   user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
   },
   items: [
    {
        product: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            require:true
        },
        quantity: {
            type:Number,
            required:true,
            default:1
        },
    }
   ] 
});

module.exports = mongoose.model('Cart', CartSchema)