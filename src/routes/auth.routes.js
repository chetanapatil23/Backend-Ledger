const express = require("express")
const authController = require("../controllers/auth.controller")


const router = express.Router()

//POST/API/AUTH/REGISTER
router.post("/register",authController.userRegisterController)
//POST/API/AUTH/LOGIN
router.post("/login",authController.userLoginController)
//POST/API/AUTH/LOGOUT
router.post("/logout",authController.userLogoutController)


module.exports = router;