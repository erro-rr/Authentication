const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidator, sendEmailVerificationValidator } = require('../helpers/validator');
const authController = require('../controllers/authController');

// Middleware
router.use(express.json());

// Use of Multer for user profile image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
            cb(null, path.join(__dirname, '../public/images'));
        }
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    }
})

// Filter for the image 
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
// Uploading image
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Router for User registration
router.post('/register', upload.single('image'), registerValidator, userController.userRegister);
router.get('/send-mail-verification', sendEmailVerificationValidator, authController.sendMailVerification);

module.exports = router;

