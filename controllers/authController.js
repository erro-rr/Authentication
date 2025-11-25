const mongoose = require('mongoose');
const User = require('../models/userModel');
const { message } = require('statuses');
const mailers = require('../helpers/mailers');
const { validationResult } = require("express-validator");
const randomstring = require('randomstring');
const passwordResetModel = require('../models/passwordResetModel');
const bcrypt = require('bcrypt');

const mailVerification = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.render('404');
    }

    /// checking if id is valid as per mongodb structure 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.render('mail-verification.ejs', {
        message: 'Invalid or corrupted verification link'
      });
    }

    const userData = await User.findById(id);

    if (!userData) {
      return res.render('mail-verification.ejs', {
        message: 'User not found'
      });
    }

    // Checking if mail is already verified or not

    if (userData.isVerified === 1) {
      return res.render('mail-verification.ejs', { message: 'Mail is already verified' });
    }

    // updating isVerified as One
    userData.isVerified = 1;
    await userData.save();

    return res.render('mail-verification.ejs', {
      message: 'Mail verified successfully'
    });

  } catch (error) {
    console.log(error.message);
    return res.render('404');
  }
};

// if anyone missed the mail somehow then we need a api to trigger it again
const sendMailVerification = async (req, res) => {
  try {
    // checking mail validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        msg: 'Errors',
        Errors: errors.array()
      })
    }
    else {

      // Checking if mail is register or existing in our database or not
      const { email } = req.body;
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({
          success: false,
          msg: "Email is not register"
        })
      }

      // Checking if mail is already verified or not
      if (userData.isVerified == 1) {
        return res.status(400).json({
          success: false,
          msg: userData.email + " is already verified"
        })
      }

      // Sending verification link through mail
      const msg = `<p>Hi ${userData.name}, please verify your email using this <a href="http://127.0.0.1:5000/API/mail-verification?id=${userData._id}">verification link</a>.</p>`;
      mailers.sendMail(email, 'Mail Verification', msg);
      return res.status(200).json({
        success: true,
        msg: "Verification link is send on " + userData.email
      })
    }
  }
  catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    })
  }
}

const forgotPassword = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        msg: errors.array()
      })
    }

    const { email } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
      res.status(400).json({
        success: false,
        msg: "Email is not registered"
      })
    }
    else {
      const randomString = randomstring.generate();
      const content = '<p>Hii ' + userData.name + ', Please click <a href = "http://127.0.0.1:5000/API/reset-password?token=' + randomString + '">here</a> to reset your password</p>';
      const resetRecord = new passwordResetModel({
        userId: userData._id,
        token: randomString
      });

      await resetRecord.save();

      mailers.sendMail(userData.email, 'Password Reset', content);
      res.status(201).json({
        success: true,
        msg: `Reset password mail sent on this ${userData.email}`
      })
    }


  }
  catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message
    })
  }
};

const resetPassword = async (req, res) => {
  try {
    if (req.query.token == undefined) {
      return res.render('404');
      console.log("1");
    }
    const userPasswordResetData = await passwordResetModel.findOne({ token: req.query.token })
    if (!userPasswordResetData) {
      console.log("2");
      return res.render('404');
    }
    else {
      return res.render('passwordResetPage', { userPasswordResetData });
    }

  }
  catch (error) {
    console.log(error);
    return res.render('404');
  }
}


const updatePassword = async (req, res) => {
  try {
    const { user_id, password, c_password } = req.body;
    const userPasswordResetData = await passwordResetModel.findOne({ _id: user_id });

    if (!userPasswordResetData) {
      // If null → never render reset form again
      return res.render("404");
    }
    if (password != c_password) {
      res.render('passwordResetPage', { userPasswordResetData, error: 'Your confirm password is not matching with new password' })
    }
    else {
      if (userPasswordResetData.token !== req.query.token) {
        return res.render("passwordResetPage", {
          userPasswordResetData,
          error: "Invalid or expired token",
        });
      }
      else {
        console.log("jjjjj")
        const hashPassword = await bcrypt.hash(c_password, 10);
        await User.findByIdAndUpdate(user_id, {
          $set: {
            password: hashPassword
          }
        })
        await passwordResetModel.findByIdAndDelete(user_id);
        return res.redirect('/API/reset-success');
      }
    }
  }
  catch (error) {
    console.log(error);
    res.render('404');
  }
}

const resetSuccess = async (req, res) => {
  try {
    return res.render('resetSuccess.ejs');
  }
  catch (error) {
    console.log(error);
    return res.render('404');
  }
}

module.exports = {
  mailVerification,
  sendMailVerification,
  forgotPassword,
  resetPassword,
  updatePassword,
  resetSuccess
};
