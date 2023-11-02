const { urlencoded } = require('body-parser')
const express = require('express')
const dotenv = require('dotenv').config()
const app = express()
const PORT = process.env.port || 4000


app.use(urlencoded({extended: false}))
app.use(express.json())

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})