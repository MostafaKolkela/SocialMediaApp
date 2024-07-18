const jwt = require('jsonwebtoken') 
const appError = require('../utils/appError')
const httpStausText = require('../utils/httpStatusText')

const authToken = (req,res,next)=>{

    const header = req.headers['authorization'] || req.headers['Authorization']
    if(!header){
        const error = appError.create('token is required',401,httpStausText.ERROR)
        return next(error)
    }
    const token = header.split(' ')[1]
    try{
    const currentUser = jwt.verify(token,process.env.JWT_KEY)
    req.currentUser = currentUser
    next()
    }catch(err){
        const error = appError.create('invalid token',401,httpStausText.ERROR)
        return next(error)
    }
}

module.exports = authToken