const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const blackListModel = require("../models/blackList.model")

async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unathorized access, token is missing"
        })
    }

    const blacklistedToken = await blackListModel.findOne({ token: token })

    if (blacklistedToken) {
        return res.status(401).json({
            message: "Unathorized access, token is blacklisted hello"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId)
        req.user = user  //req user me save karage 
        return next()  // middleware ke baad wale function ko call karega


    } catch (err) {
        return res.status(401).json({
            message: "Unathorized access, Invalid token"
        })
    }
}


async function authSystemuserMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unathorized access, token is missing"
        })
    }

    const blacklistedToken = await blackListModel.findOne({ token: token })

    if (blacklistedToken) {
        return res.status(401).json({
            message: "Unathorized access, token is blacklisted"
        })
    }


    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, only system user can access this resource"
            })
        }
        req.user = user  //req user me save karage
        return next()  // middleware ke baad wale function ko call karega

    } catch (err) {
        return res.status(401).json({
            message: "Unathorized access, Invalid token"
        })
    }
}

module.exports = { authMiddleware, authSystemuserMiddleware } //this type of export call object export