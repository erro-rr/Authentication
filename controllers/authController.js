const mongoose = require('mongoose');
const User = require('../models/userModel');
const { message } = require('statuses');

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

    if(userData.isVerified === 1){
        return res.render('mail-verification.ejs',{message:'Mail is already verified'});
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

module.exports = { mailVerification };
