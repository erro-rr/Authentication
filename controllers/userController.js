const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const deleteUploadFilefunc = require('../helpers/deleteUploadFile');
const mailers = require('../helpers/mailers');
const jwtToken = require('jsonwebtoken');
require('dotenv').config();

const userRegister = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {

      // If we found any error due to validation then delete image file which is already upload and send error status
      deleteUploadFilefunc(req.file);
      return res.status(400).json({
        success: false,
        Msg: "Error",
        Error: error.array()
      })
    }

    // taking parameter from request body
    const { name, email, password, mobile } = req.body;
    console.log(req.body);

    // Checking if email is already register or not
    const isUserExists = await user.findOne({ email });
    if (isUserExists) {

      // If email is aleady in db or any user is register with this email then delete the tmp image and send error status
      deleteUploadFilefunc(req.file);
      return res.status(400).json({
        success: false,
        msg: 'Email Already Exists',
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // console.log('Hashed Password:', hashPassword);

    // data according to user schema
    const newUser = new user({
      name,
      email,
      password: hashPassword,
      mobile,
      image: 'images/' + req.file.filename,
    });

    console.log('New User:', newUser);

    // save data in mongo and send status 
    const userData = await newUser.save();
    console.log(userData);
    const msg = `<p>Hi ${name}, please verify your email using this <a href="http://127.0.0.1:5000/API/mail-verification?id=${userData._id}">verification link</a>.</p>`;

    mailers.sendMail(email, 'Mail Verification', msg);
    return res.status(200).json({
      success: true,
      msg: 'User Registered Successfully',
      userDetails: {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        isVerified: userData.isVerified,
        image: userData.image
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};


const userLogin = async (req, res) => {
  try{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).json({
      status:false,
      errors:errors.array()
    })
  }
  else{
  const { email, password } = req.body;
  const userData = await user.findOne({ email });
  if (!userData) {
    return res.status(400).json({
      success: false,
      msg: "Invalid credentials"
    })
  }
  const matchPassword = await bcrypt.compare(password, userData.password);
  if (!matchPassword) {
    return res.status(400).json({
      success: false,
      msg: "Invalid credentials"
    })
  }
  else{

  // generate jwt token

  const generateJwtToken = jwtToken.sign({
    id: userData._id,
    email: userData.email
  },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES

    }
  )

  res.status(200).json({
    success:true,
    msg:"Login Successfully",
    userData:userData,
    token:generateJwtToken
  })
  }
}
  }
catch(error){
  console.log(error);
  return res.status(400).json({
    succes:false,
    error:error
  })
}
}


module.exports = {
  userRegister,
  userLogin
};
