const User = require('../models/usemodel')
const admin = require('../models/admin')

const registerUser = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res
    }
}

const loginUser = (req, res) => {

}