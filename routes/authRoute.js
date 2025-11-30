const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { sendEmailVerificationValidator, passwordResetValidator } = require('../helpers/validator')
const refreshTokenMiddleware=require('../middleware/refreshTokenMiddleware');
router.use(express.json());

router.get('/mail-verification', authController.mailVerification);
router.get('/send-mail-verification', sendEmailVerificationValidator, authController.sendMailVerification);
// use for sending mail for forgot password
router.post('/forgot-password', passwordResetValidator, authController.forgotPassword);
router.get('/reset-password', authController.resetPassword);
router.post('/reset-password', authController.updatePassword);
router.get('/reset-success', authController.resetSuccess);
// Authenticated Endpoints
router.get('/refresh-token',refreshTokenMiddleware,authController.refreshToken);


module.exports = router;