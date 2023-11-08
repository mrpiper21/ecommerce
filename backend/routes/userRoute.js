const express = require('express');
const router = express.Router();
const { createUser, loginUser, getAllUser, getSingleUser, deleteUser, updateAuser, unblockUser, blockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middleware/authmiddleware');

router.post('/register', createUser).post('/login', loginUser);
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/password', authMiddleware, updatePassword)
router.get('/refresh', handleRefreshToken).get('/logout', logout)
router.get('/all-users', getAllUser)
router.get('/:id', authMiddleware, isAdmin, getSingleUser)
router.delete('/:id', deleteUser)
router.put('/edit-user', authMiddleware, updateAuser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser).put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)

module.exports = router;