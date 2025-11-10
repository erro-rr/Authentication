const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const { error } = require('console');
const { registerValidator } = require('../helpers/validator');

router.use(express.json());

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

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.post('/register', upload.single('image'), registerValidator, userController.userRegister);

module.exports = router;

