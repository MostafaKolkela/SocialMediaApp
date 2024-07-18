const asyncWrapper = require('../middleware/asyncWraper')
const Users = require('../model/user.model')
const appError = require('../utils/appError')
const httpStausText = require('../utils/httpStatusText')
const bcrypt = require('bcrypt')
const jwtGen = require('../utils/generateJwt')

const getUsers = asyncWrapper(
    async (req,res,next)=>{
        const query = req.query
        const limit = query.limit || 10
        const page = query.page || 1
        const skip = (page-1)*limit
        const users = await Users.find({},{"__v":false,"password":false}).limit(limit).skip(skip)
        res.status(200).json({status:httpStausText.SUCCESS,data:{users}});
    }
)

const register = asyncWrapper(
    async (req,res,next)=>{

        const oldMail = await Users.findOne({email:req.body.email})
        if(oldMail){
            const error = appError.create('dublicate email',400,httpStausText.FAIL)
            return next(error)
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        const newUser = new Users({
            ...req.body,
            password:hashedPassword,
            avatar:req.file.filename
        })

        const token = await jwtGen({email:newUser.email,id:newUser._id,role:newUser.role})
        newUser.token = token
        await newUser.save()
        return res.status(201).json({status:httpStausText.SUCCESS,data:{newUser}});
    }
)
 
const login = asyncWrapper(
    async (req,res,next)=>{
        const {email,password}=req.body
        if(!email || !password){
            const error = appError.create('email and password are required',400,httpStausText.FAIL)
            return next(error)
        }
        const user = await Users.findOne({email:email})
        if(!user){
            const error = appError.create('user not found',400,httpStausText.FAIL)
            return next(error)
        }
        const matchedPassword = await bcrypt.compare(password,user.password)
        if(matchedPassword){
            const token = await jwtGen({email:user.email,id:user._id,role:user.role}) 
            return res.status(201).json({status:httpStausText.SUCCESS,data:{token}});
        }else{
            const error = appError.create('password wrong',500,httpStausText.ERROR)
            return next(error)
        }
    }
)



module.exports={
    getUsers,
    login,
    register,
}