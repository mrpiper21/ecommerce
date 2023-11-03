const express = require('express');
const router = express.Router();
const { createUser, loginUser, createAdmin} = require('../controllers/userController')

router.post('/register', createUser).post('/admin', createAdmin).post('/login', loginUser);

module.exports = router;