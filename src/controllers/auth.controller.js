const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const blackListModel = require("../models/blackList.model")
//user register controller 
//post api/auth/register

async function userRegisterController(req, res) {
    const { email, password, name } = req.body

    const isExist = await userModel.findOne({
        email: email
    })

    if (isExist) {
        return res.status(422).json({
            message: "User already exists with email",
            status: "failed"
        })
    }

    const user = await userModel.create({
       email,password,name
    })

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token",token)
    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })

   await emailService.sendRegistrationEmail(user.email, user.name)
    
}

//userlogin controller
//post api/auth/login

async function userLoginController(req,res){
    const { email,password } =req.body

    const user = await userModel.findOne({email}).select("+password")// ye is liye  used hua kyu ki hamane usermodel me password slected false diya tha wo password pass nahi karaega thatwhy

    if(!user){
        return res.status(401).json({
            message:"Email or Password is Invalid"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword){
         return res.status(401).json({
            message:"Email or Password is Invalid"
        })
    }

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token",token)
    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })
}

async function userLogoutController(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]//yeh token ko cookie se le raha hai ya header se le raha hai authorization header me token aata hai to split karke le raha hai

    if(!token){
        return res.status(200).json({
            message:"User logged out successfully"
        })       
    }
    await blackListModel.create({
        token:token
    })
        res.clearCookie("token")//yeh cookie ko clear kar dega browser se
        res.status(200).json({
            message:"Logout successful"
})
  

}


module.exports = { userRegisterController , userLoginController , userLogoutController }