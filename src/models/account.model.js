const mongoose = require("mongoose")
const ledgerModel = require("./ledger.model")

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with a user"],
        index:true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],//FROZEN matalb account colse bhi nahi hai or used bhi nahi ho raha hai
            message: "Status can be either ACTIVE,FROZEN or CLOSED"
        },
        default:"ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account "],
        default: "INR"
    }
}, {
    timestamps:true  //user ka aacount kab create kiya tha wo show karata hai 
})
accountSchema.index({user:1,status:1}) //do filed pe index create kare sath me to use compaundindex bolte hai


accountSchema.methods.getBalance = async function () {

    const balanceData = await ledgerModel.aggregate([ //aggregation pipeline use kar raha hai jisme hum ledger collection se data le rahe hai aur usme se debit aur credit ko calculate kar ke balance nikal rahe hai mongooose feature hai aggregate jisme custom queries run kar sakte hai
        { $match: { account: this._id } },// uun sabhi ledger entry dudho ko match hoti ho is particular account ke sath
        {
            $group: { //group stage me hum data ko group kar rahe hai account ke hisab se aur usme se total debit aur total credit nikal rahe hai
                _id: null,// kyuki hume group by karne ki zarurat nahi hai hum to bas is account ke liye balance nikal rahe hai to _id null kar dete hai
                totalDebit: {// total debit nikalne ke liye hum $sum operator use kar rahe hai jisme hum $cond operator use kar rahe hai jisme condition ye hai ki agar type debit hai to amount ko sum karo nahi to 0 ko sum karo
                    $sum: {
                        $cond: [//yeh condition hai ki agar type debit hai to amount ko sum karo nahi to 0 ko sum karo
                          { $eq: [ "$type", "DEBIT" ] },// $eq equal agar type debit hai to amount ko sum karo nahi to 0 ko sum karo
                            "$amount",// agar condition true hai to amount ko sum karo
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "CREDIT" ] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {  //project stage me hum final output ko shape kar rahe hai jisme hume balance nikalna hai to total credit me se total debit ko minus kar ke balance nikal rahe hai
                _id: 0, // _id ko 0 kar rahe hai kyuki hume _id ki zarurat nahi hai output me
                balance: { $subtract: [ "$totalCredit", "$totalDebit" ] } //balance nikalne ke liye total credit me se total debit ko minus kar rahe hai
            }
        }
    ])

    if (balanceData.length === 0) {
        return 0
    }

    return balanceData[ 0 ].balance//balance data array me se pehla element le rahe hai jisme balance hai

}


const accountModel = mongoose.model("account",accountSchema)
module.exports = accountModel
