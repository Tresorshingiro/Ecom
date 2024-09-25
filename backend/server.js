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
const upload = require('./middleware/uploadMiddleware')

//express app
const app = express()

//middleware
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.use('/uploads', express.static('uploads'));
// Routes with file upload mddleware
app.post('/api/products', upload.single('image'), require('./controllers/productController').createProduct)
//routes
app.use('/api/products', productsRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/category', categoryRoutes)

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