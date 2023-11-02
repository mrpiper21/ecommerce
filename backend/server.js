const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const PORT = process.env.port || 4000
const userRoute = require('./routes/userRoute')

dotenv.config()

connectDB()

const app = express()

app.use('/', (req, res) => {
    res.send('Hello from server')
})

app.use('/api/users', userRoute);
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})