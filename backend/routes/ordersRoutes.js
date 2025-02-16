const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/ordersController');


router.get('/all', protect, admin, getAllOrders); 
router.get("/orders/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (id === "all") {
            // Fetch all orders for admin
            const orders = await Order.find().populate("user", "name email"); // Add user details if needed
            return res.json(orders);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Fetch orders for a specific user
        const orders = await Order.find({ user: id }).populate("user", "name email").exec();

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', protect, createOrder); 
router.get('/', protect, getUserOrders); 
router.patch('/:id/status', protect, admin, updateOrderStatus); 

module.exports = router;