const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const PORT = 5000
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const blogRoute = require('./routes/blogRoute')
const cookieParser = require("cookie-parser")
const morgan = require('morgan')
const categoryRoute = require('./routes/productCategoryRoute')
const blogCatRouter = require('./routes/blogCatRoute')
const couponRoute = require('./routes/couponRoute')
dotenv.config()

connectDB();

const app = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

//app.set('views', './views');
//app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>') // Error: Cannot set headers after they are sent to the client
  });

app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/coupon', couponRoute)
app.use('/api/blog', blogRoute)
app.use('/api/category', categoryRoute)
app.use('/api/blogcategory', blogCatRouter)

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})