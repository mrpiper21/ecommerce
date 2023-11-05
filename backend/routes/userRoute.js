const express = require('express');
const router = express.Router();
const { createUser, loginUser, getAllUser, getSingleUser, deleteUser, updateAuser } = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middleware/authmiddleware');

router.post('/register', createUser).post('/login', loginUser);
router.get('/all-users', getAllUser)
router.get('/:id', authMiddleware, isAdmin, getSingleUser)
router.delete('/:id', deleteUser)
router.put('/edit-user', authMiddleware, updateAuser)

module.exports = router;