const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { sendEmailVerificationValidator, passwordReset } = require('../helpers/validator')
router.use(express.json());

router.get('/mail-verification', authController.mailVerification);
router.get('/send-mail-verification', sendEmailVerificationValidator, authController.sendMailVerification);
router.post('/forgot-password', passwordReset,authController.passwordReset);


module.exports = router;