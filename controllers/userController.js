const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path'); 

const userRegister = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    console.log(req.body);

    const isUserExists = await user.findOne({ email });
    if (isUserExists) {
      if (req.file) {
        fs.unlink(path.join(__dirname, '../public/images', req.file.filename), (err) => {
          if (err) console.error('Unable to delete file:', err);
        });
      }
      return res.status(400).json({
        success: false,
        msg: 'Email Already Exists',
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashPassword);

    const newUser = new user({
      name,
      email,
      password: hashPassword,
      mobile,
      image: 'images/' + req.file.filename,
    });

    console.log('New User:', newUser);

    const userData = await newUser.save();

    return res.status(200).json({
      success: true,
      msg: 'User Registered Successfully',
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      msg: error.message,
      check: 'check',
    });
  }
};

module.exports = {
  userRegister,
};
