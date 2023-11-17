const User = require('../models/userModel');
const Product = require('../models/productmodel')
const Cart = require('../models/cartModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')
const uniqid = require('uniqid')
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const validateMongoDbId = require('../utils/validateMongodb');
const { generateRefreshToken } = require('../config/refreshtoken');
const sendEmail = require('./emailController')
const jwt = require("jsonwebtoken")
const crypto = require('crypto')


const createUser = asyncHandler (async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  // Check if any required fields are missing
  if (!firstname || !lastname || !mobile || !email || !password) {
    return res.status(400).json({
      msg: 'Please fill in all fields'
    });
  } 
  
  const userExist = await User.findOne({ email });

  //Hash password
  // const salt = await bcrypt.genSalt(10)
  // const hashedPassword = await bcrypt.hash(password, salt)

  if (!userExist) {
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      mobile,
      password
    });
    return res.status(201).json(newUser);
    
  } else {
    return res.status(400).json({
      msg: 'User already exist!',
      success: false
    });
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Checks for the user to input all fields
  if (!email || !password) {
    return res.status(401).json({
      msg: 'provide all fields',
      success: false
    })
  }

  // Check if the user is authorized by finding the email in the database
  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('invalid email or password!')
  
  // if the user is validated we generate a token upon login is sucessful and refresh token whenever the page is refreshed
  if (user && await user.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(user?._id);
    const updateuser = await User.findByIdAndUpdate(
      user._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    
    res.cookie("refreshToken", refreshToken,{
      httpOnly: true,
      maxAge: 72 * 60 *1000,
    })
    return res.status(200).json({
      _id: user?._id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      mobile: user?.mobile,
      token: generateToken(user?._id)
    })
  } else {
    return res.status(400).json({
      msg:'invalid email or password!',
      success: false,})
    }
})

// admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Checks for the user to input all fields
  if (!email || !password) {
    return res.status(401).json({
      msg: 'provide all fields',
      success: false
    })
  }

  // Check if the user is authorized by finding the email in the database
  let admin = await User.findOne({ email: req.body.email })
  if (!admin) return res.status(400).send('invalid email or password!')
  if (admin.role !== 'admin'){
    throw new Error('Not Authorized')
  }
  // if the user is validated we generate a token upon login is sucessful and refresh token whenever the page is refreshed
  if (admin && await admin.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(admin?._id);
    const updateuser = await User.findByIdAndUpdate(
      admin._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    
    res.cookie("refreshToken", refreshToken,{
      httpOnly: true,
      maxAge: 72 * 60 *1000,
    })
    return res.status(200).json({
      _id: admin?._id,
      firstname:admin?.firstname,
      lastname: admin?.lastname,
      email: admin?.email,
      mobile: admin?.mobile,
      token: generateToken(admin?._id)
    })
  } else {
    return res.status(400).json({
      msg:'invalid email or password!',
      success: false,})
    }
})

// logout
const logout = asyncHandler(async(req, res) => {
  const cookie = req.cookies
  if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
  const refreshToken = cookie.refreshToken
  const user = await User.findOne({ refreshToken })
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({refreshToken: refreshToken}, {
    refreshToken: "",
  })
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204)
})

// handle refresh token
const handleRefreshToken = asyncHandler(async(req, res) => {
  const cookie = req.cookies;
  console.log(cookie)
  if (!cookie?.refreshToken) throw new Error("No Refresh token in cookie")
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken)
  const user = await User.findOne({ refreshToken })
  if (!user) throw new Error("No Refresh token present in database")
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token")
    }
    const accessToken = generateToken(user?._id)
    res.json({ accessToken })
  })
})


// Update a user
const updateAuser = asyncHandler(async(req, res) => {
  //console.log(req.user)
  const { _id } = req.user;
  validateMongoDbId(_id)
  try {
    const userUpdate = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    )
    res.json(userUpdate)
  } catch (error){
      throw new Error(error)
  }
})

// save use address
const saveAddress = asyncHandler(async(req, res) => {
  const { _id } = req.user;
  try {
    const userUpdate = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    )
    res.json(userUpdate)
  } catch (error){
      throw new Error(error)
  }
})

// Get all users
const getAllUser = asyncHandler(async( req, res) => {
  try {
    const gerUsers = await User.find().populate('whishlist');
    res.json(gerUsers);
  } catch (error) {
    throw new Error(error);
  }
})

// Get a single user
const getSingleUser = asyncHandler(async(req, res) => {
const { id } = req.params
validateMongoDbId(id)
  try {
    const getUser = await User.findById(id)
    res.json(getUser)
  } catch (error) {
    throw new Error(error)
  }
})

const deleteUser = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const delUser = await User.findByIdAndDelete(id)
    res.json(delUser);
  } catch (error) {
    throw new Error(error)
  }
})

const blockUser = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const block = await User.findByIdAndUpdate(id,
      {
        isBlocked: true,
      },
      {
        new: true,
      },
    )
    res.json(block)

  } catch (error) {
    throw new Error(error)
  }
})

const unblockUser = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const unblock = await User.findByIdAndUpdate(id,
      {
        isBlocked: false,
      },
      {
        new: true,
      },
    )
    res.json({
      msg: "User is unblocked"
    })

  } catch (error) {
    throw new Error(error)
  }
})

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const password = req.body.password;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword)
  } else {
    res.json(user)
  }
})

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const email = req.body.email;
  console.log(email)

  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found with this email')
  try {
    const token = await user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false });
    const resetURL = `Hi, Please follow this link to reset your passord. The link is valid for 10 minutes. <a href='http://localhost:4000/api/user/reset-password/${token}'>click here</>`
    const data = {
      to: email,
      text: "Hey user",
      subject: 'Forgot Password Link',
      html: resetURL
    };
    sendEmail(data)
    res.json(token)
  } catch (error) {
    throw new Error(error)
  }
})

const resetPassword = asyncHandler(async (req, res) => {
  const password = req.body.password
  const token = req.params.token
  const hashedtoken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({
    passworeResetToken: hashedtoken,
    passwordResetExpires: { $gt: Date.now()}
  })
  if (!user) throw new Error('Token Expired, please try again later')
  user.password= password;
  user.passworeResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user)
})

const getWishlist = asyncHandler(async(req, res) => {
  const { _id } = req.user;
  try {
    const findUser = User.findById(_id).populate('wishlist')
    res.json(findUser)
  } catch (error) {
    throw new Error(error)
  }
});

// user cart
const userCart = asyncHandler(async (req, res) => {
 const { cart } = req.body;
 const { _id } = req.user;
 const user = await User.findById(_id)
 try {
  let products = []
  const user = await User.findById(_id)
  // chech if user already have product in cart
  const alreadyExistCart = await Cart.findOne({ orderby: user._id });
  if(alreadyExistCart){
    alreadyExistCart.remove()
  }
  for (let i= 0; i<cart.length; i++){
    let object = {}
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    let getPrice = await Product.findById(cart[i]._id.select('price').exec)
    object.price = getPrice.price;
    products.push(object)
  }
  let cartTotal = 0;
  for (let i=0; i<products.length; i++){
    cartTotal = cartTotal  + products[i].price * products[i].count
  }
  let newCart = await new Cart({
    products,
    cartTotal,
    orderby: user?._id,
  }).save();
  res.json(newCart)
 } catch (error){
  throw new Error(error)
 }
})

// getting user cart
const getUserCart = asyncHandler(async(req, res) => {
  const { _id } = req.user;
  try {
    const cart = await Cart.findOne({ orderby: _id}).populate('products.product')
    res.json(cart)
  } catch (error){
    throw new Error(error)
  }
})

const emptyCart = asyncHandler(async(req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findByIdAndRemove({ orderby: user._id });
    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
})

const applyCoupon = asyncHandler(async(req, res) => {
  const { coupon } = req.body;
  const validCoupon = await coupon.findOne({ name: coupon });
  if(validCoupon === null){
    throw new Error('Invalid Coupon')
  }
  const user = await User.findOne({ _id });
  let { products, cartTotal } = await Cart.findOne({ orderby: user._id}).populate('products.product')
  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100)
  .toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: use._id },
    { totalAfterDiscount },
    {new: true })
    res.json(totalAfterDiscount)
})

const createOrder = asyncHandler(async(req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user
  try {
    if(!COD) throw new Error('crete cash order failed');
    const user = await User.findById(_id)
    let userCart = await Cart.findOne({ orderby: user._id })
    let finalAmount = 0
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.Products,
      paymentIntent: {
        id: uniqid(),
        method: 'COD',
        amount: finalAmount,
        status:  "Cash on Delivery",
        created: Date.now(),
        currency: 'cedi'
      },
      orderby: user._id,
      orderStatus: 'Cash on Delivery'
    }).save()
    let update = userCartl.product.mapK((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quality: -item.count, sold: +item.count } }
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: 'success' });
  } catch (error) {
    throw new Error(error);
  }
})

const getOrders = asyncHandler(async(req, res) => {
  const { _id } = req .user;
  try {
    const userorders = await Order.findOne({ orderby: _id}).populate('products.prduct').exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
})

const updateOrderStatus = asyncHandler(async(req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const orderStatusUpdate = await Order.findByIdAndUpdate(id, 
    { orderStatus: status,
      paymentIntent: {
        status: status, 
      },
    },
    { new: true })
    res.json(orderStatusUpdate)
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = { createUser,
  loginUser,
  logout,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateAuser ,
  blockUser,
  unblockUser,
  handleRefreshToken,
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
  updateOrderStatus
  }