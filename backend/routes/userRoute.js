const express = require('express');
const router = express.Router();
const { createUser, 
    loginUser,
     getAllUser, 
     getSingleUser, 
     deleteUser, 
     updateAuser, 
     unblockUser, 
     blockUser, 
     handleRefreshToken, 
     logout,
     updatePassword, 
     forgotPasswordToken, 
     resetPassword, 
     loginAdmin, 
     getWishlist,
     saveAddress,
     userCart,
     getUserCart,
     emptyCart,
     applyCoupon,
     createOrder,
     getOrders,
     updateOrderStatus} = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middleware/authmiddleware');

router.post('/register', createUser).post('/login', loginUser).post('/admin-login', loginAdmin);
router.post('/forgot-password-token', forgotPasswordToken)
router.post('/cart', authMiddleware, userCart)
router.post('/cart/applycoupon', authMiddleware, applyCoupon )
router.post('/cart/cash-order', authMiddleware, createOrder)
router.put('/reset-password/:token', resetPassword)
router.put('/password', authMiddleware, updatePassword)
router.put('/save-address', authMiddleware, saveAddress)
router.get('/wishlist', authMiddleware, getWishlist)
router.get('/cart', authMiddleware, getUserCart)
router.get('/get-orders', authMiddleware, getOrders)
router.get('/refresh', handleRefreshToken).get('/logout', logout)
router.get('/all-users', getAllUser)
router.get('/:id', authMiddleware, isAdmin, getSingleUser)
router.delete('/:id', deleteUser)
router.delete('/empty-cart', authMiddleware, emptyCart)
router.put('/edit-user', authMiddleware, updateAuser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser).put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)
router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus)
module.exports = router;