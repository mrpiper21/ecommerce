const express = require('express');
const router = express.Router();
const { createUser, loginUser} = require('../controllers/userController')

router.post('/register', createUser).post('/login', loginUser);

module.exports = router;