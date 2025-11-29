const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenVerification = async (req, res, next) => {
    try {
        const completeToken = req.headers['authorization'];
        if (!completeToken) {
            res.status(401).json({
                status: false,
                msg: "Token is not provided"
            })
        }
        const completeTokenSplitted = completeToken.split(" ");
        const token = completeTokenSplitted[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({
            status: false,
            msg: "Invalid token"
        })
    }
}

module.exports = tokenVerification;