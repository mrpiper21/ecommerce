const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');

const createUser = asyncHandler (async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  // Check if any required fields are missing
  if (!firstname || !lastname || !mobile || !email || !password) {
    return res.status(400).json({
      msg: 'Please fill in all fields'
    });
  } 
  
  const userExist = await User.findOne({ email });

  // Hash password
  // const salt = await bcrypt.genSalt(10)
  // const hashedPassword = await bcrypt.hash(password, salt)

  if (!userExist) {
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      mobile,
      password: hashedPassword
    });
    return res.status(201).json(newUser);
    
  } else {
    return res.status(400).json({
      msg: 'User already exist!',
      success: false
    });
  }
})

// const createAdmin = asyncHandler(async (req, res) => {
//   const { firstname, lastname, email, mobile, password } = req.body

//   if (!firstname || !lastname || !email || !mobile || !password){
//     res.status(400)
//     throw new Error('Please add all field')
//   }

//   const adminExist = await User.findOne( {email} )

//   if (!adminExist) {
//     const newAdmin = await User.create({
//       firstname,
//       lastname,
//       email,
//       mobile,
//       password,
//     })
//     res.json({newAdmin})
//   } else {
//     res.status(400).json({
//       msg: 'User already exist!',
//       success: false
//     });
//   }

// })

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //const userExist = await User.findOne({ email });

  if (!email || !password) {
    return res.status(401).json({
      msg: 'provide all fields',
      success: false
    })
  }

  

  //if both match than you can do anything
  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('invalid email and password!')
 
  if (user && await user.isPasswordMatched(password)) {
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
      msg:'invalid email and password!',
      success: false,})
    }
})


// Update a user
const updateAuser = asyncHandler(async(req, res) => {
  console.log(req.user)
  const { _id } = req.user;
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
  try {
    const getUser = await User.findById(id)
    res.json(getUser)
  } catch (error) {
    throw new Error(error)
  }
})

const deleteUser = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try {
    const delUser = await User.findByIdAndDelete(id)
    res.json(delUser);
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateAuser }