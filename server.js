const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const uri = process.env.MONGO_URL

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(express.json());

const usersRouter = require('./routes/users.route')
const httpStatusText = require('./utils/httpStatusText')
const appError = require('./utils/appError')


// Routes
app.use('/api/users',usersRouter)
app.all('*',(req,res,next)=>{
    return res.status(400)
        .json({status:httpStatusText.ERROR,data:null,massage:'this resource is not available'.massage,code:400})
})
app.use((error,req,res,next)=>{
    return res.status(error.statusCode || 500)
        .json({status:error.statusText || httpStatusText.ERROR,message:error.message,code:error.statusCode||500,data:null})
})

// Connect to MongoDB
mongoose.connect(uri)
.then(()=>{
    console.log('db connected')
})
.catch((err)=>{
    const error = appError.create(err.message,401,httpStatusText.ERROR)
    return next(error)
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT || 5000,()=>{
    console.log(`Server running on port ${PORT}`);
});