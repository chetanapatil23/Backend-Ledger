const express = require("express")
const authmiddleware = require("../Middleware/auth.middleware")
const accountcontroller = require("../controllers/account.controller")


const router = express.Router()
    
//post/api/accounts/
//create a new account
//protected Route means cookies or header apko token chahiye hoga but this token will be valid token

router.post("/accounts",authmiddleware.authMiddleware,accountcontroller.createAccountController)

//get/api/accounts/
//get all accounts of logged in user
//protected Route means cookies or header apko token chahiye hoga but this token will be valid token

router.get("/",authmiddleware.authMiddleware,accountcontroller.getAllAccountsController)
//get/api/accounts/balance/:accountId
//get balance of a particular account
//protected Route means cookies or header apko token chahiye hoga but this token will be valid token

router.get("/balance/:accountId",authmiddleware.authMiddleware,accountcontroller.getAccountBalanceController)
module.exports = router 