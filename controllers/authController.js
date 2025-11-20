const mongoose = require('mongoose');
const User = require('../models/userModel');
const { message } = require('statuses');
const mailers = require('../helpers/mailers');
const { validationResult } = require("express-validator");

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        msg: 'Errors',
        Errors: errors.array()
      })
    }
    else {
      const { email } = req.body;
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({
          success: false,
          msg: "Email is not register"
        })
      }
      if (userData.isVerified == 1) {
        return res.status(400).json({
          success: false,
          msg: userData.email + " is already verified"
        })
      }
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

module.exports = {
  mailVerification,
  sendMailVerification
};
