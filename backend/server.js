const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const PORT = process.env.port || 4000
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const blogRoute = require('./routes/blogRoute')
const cookieParser = require("cookie-parser")
const morgan = require('morgan')
const categoryRoute = require('./routes/categoryRoute')
dotenv.config()

connectDB();

const app = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send('<h1>Hello, world!</h1>');
    res.set('X-Custom-Header', 'Some value'); // Error: Cannot set headers after they are sent to the client
  });

app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute)
app.use('/api/category', categoryRoute)
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})