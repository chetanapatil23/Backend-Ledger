const express = require("express")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const app = express()

app.use(express.json())//body ke under data pad sake is ke liye ye used hota hai express itana capabale nahi hai ki wo data padh sake that's why this used
app.use(cookieParser())

//create routes 
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRouter = require("./routes/transaction.routes")

//used routes
app.use("/api/auth",authRouter)
app.use("/api/account", accountRouter)
app.use("/api/transactions", transactionRouter)


module.exports = app;