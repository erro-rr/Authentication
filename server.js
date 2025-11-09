require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRouter');

const app = express();
const port = process.env.PORT || 3000;
// console.log(port);
app.use('/API',userRoute);


mongoose.connect('mongodb://127.0.0.1:27017/restful_Auth_API')
 .then(()=>{console.log(`Connected to mongodb`)})
 .catch((err)=>{console.error(err)});

 
app.listen(5000,()=>{
    console.log(`Server Running on port no ${port}`);
});