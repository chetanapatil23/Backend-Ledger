const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must have a source account"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must have a source account"],
        index: true
    },
    status: {
        type: String,
        enum: {               //enum jo hai param values jo hai wo hamari rahegi
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can be either PENDING, SUCCESS or FAILED",
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "Transaction must have an amount"],
        min: [0, "Amount must be positive"]
    },
    idempotencyKey: {
        type: String,
        required: [true, "Indempotency Key is required for creating a transaction"],
        index: true,
        unique: true,
    }
}, {
    timestamps: true
})

const transactionModel = mongoose.model("transaction", transactionSchema)
module.exports = transactionModel