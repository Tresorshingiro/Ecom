const Order = require('../models/ordersModel')

//create an order
const createOrder = async (req, res) => {
    const {orderItems, totalPrice} = req.body
    const user = req.user._id

    try{
        const order = await Order.create({user, orderItems, totalPrice});
        res.status(200).json(order)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
};

//get user orders
const getUserOrders = async(req, res) => {
    
    try{
        const orders = await Order.find({user: req.user._id}).populate('orderItems.product');
        res.status(200).json(orders)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }

};

//delete an order
const deleteOrder = async(req, res) => {
    const { id } = req.params;

    try{
        const order = await Order.findOneAndDelete(id);
        if(!order) {
            res.status(404).json({error: 'Order not found'})
        }
        res.status(200).json({message: 'Order deleted successfull'})
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    deleteOrder
}
