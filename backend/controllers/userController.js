const User = require('../models/userModel');
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

// Get all users
const getAllUser = asyncHandler(async( req, res) => {
  try {
    const gerUsers = await User.find();
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
  resetPassword }