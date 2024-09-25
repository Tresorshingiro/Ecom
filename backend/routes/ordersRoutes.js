const express = require('express')
const {
    createOrder,
    getUserOrders,
    deleteOrder
} = require('../controllers/ordersControllers')

const router = express.Router()

//create an order
router.post('/', createOrder)

//get user's order
router.get('/', getUserOrders)

//delete an Order
router.delete('/:id', deleteOrder)

module.exports = router
