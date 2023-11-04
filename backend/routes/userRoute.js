const express = require('express');
const router = express.Router();
const { createUser, loginUser, createAdmin, getAllUser, getSingleUser, deleteUser, updateAuser } = require('../controllers/userController')

router.post('/register', createUser).post('/admin', createAdmin).post('/login', loginUser);
router.get('/all-users', getAllUser)
router.get('/:id', getSingleUser)
router.delete('/:id', deleteUser)
router.put('/:id', updateAuser)

module.exports = router;