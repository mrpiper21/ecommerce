const bcrypt = require('bcryptjs')
const User = require('../models/userModel')


const createUser = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields') 
    }

    const findUser = await User.findOne(email)
    if (!findUser) {

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = User.create({
            name,
            email,
            password: hashedPassword
        })
        res.json(newUser)
    }
}