const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const PORT = process.env.port || 4000
const userRoute = require('./routes/userRoute')

dotenv.config()

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send('<h1>Hello, world!</h1>');
    res.set('X-Custom-Header', 'Some value'); // Error: Cannot set headers after they are sent to the client
  });

app.use('/api/user', userRoute);
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})