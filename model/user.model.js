const mongoose = require('mongoose')
const validator = require('validator')
const userRoles=require('../utils/userRoles')

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'field must be an email']
    },
    password:{
        type:String,
        required:true
    },
    token:String,
    role:{
        type:String,
        enum:[userRoles.PRO_USER,userRoles.MANAGER,userRoles.USER],
        default:userRoles.USER
    },
    avatar:{
        type:String,
        default:'uploads/defaulfAvatar.jpg'
    }
})

module.exports = mongoose.model('User',userSchema)