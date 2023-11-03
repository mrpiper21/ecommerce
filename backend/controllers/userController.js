// const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler')

const createUser = asyncHandler (async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  // Check if any required fields are missing
  if (!firstname || !lastname || !mobile || !email || !password) {
    return res.status(400).json({
      msg: 'Please fill in all fields'
    });
  } 
  
  const userExist = await User.findOne({ email });

  if (!userExist) {
    // Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      mobile,
      password //: hashedPassword
    });

    return res.json(newUser);
  } else {
    return res.status(400).json({
      msg: 'User already exist!',
      success: false
    });
  }
})

const createAdmin = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, DOB, Bussiness, mobile, password } = req.body
  const adminExist = User.findOne( {email} )
  if (!adminExist) {
    const newAdmin = await User.create({
      firstname,
      lastname,
      email,
      Bussiness,
      mobile,
      password
    })
    return res.json({newAdmin})
  } else {
    res.status(400).json({
      msg: 'User already exist!',
      success: false
    });
  }

  if (!firstname || !lastname || !email || !Bussiness || !mobile || !password){
    res.status(400)
    throw new Error('Please add all field')
  }
})

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (!userExist) {
    throw new Error('User does not exist');
  }

  res.send('Login successful');
  console.log(email, password);
};

module.exports = { createUser, createAdmin, loginUser };