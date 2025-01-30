require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const productsRoutes = require('./routes/productRouter')
const userRoutes = require('./routes/user')
const orderRoutes = require('./routes/ordersRoutes')
const cartRoutes = require('./routes/cartRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const typeRoutes = require('./routes/typeRoutes')
const upload = require('./middleware/uploadMiddleware')
const adminRoutes = require('./routes/adminRoutes')
const {protect, admin} = require('./middleware/authMiddleware')
const path = require('path')
const paymentRoutes = require('./routes/paymentRoutes')

//express app
const app = express()

// Make sure process.env.JWT_SECRET is available
if (!process.env.SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.')
    process.exit(1)
}

//middleware
app.use(express.json())
app.use(cors())

// Serve static files from the uploads directory
app.use('/uploads', (req, res, next) => {
    console.log('Accessing image:', req.url);
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Public routes (no protection needed)
app.use('/api/admin', adminRoutes)

// Protected routes
app.use('/api/products', productsRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/type', typeRoutes)
app.use('/api/payments', paymentRoutes)

//connect to db
mongoose.connect(process.env.MONG_URI)
.then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT)
})
})
.catch((error) => {
    console.log(error)
})