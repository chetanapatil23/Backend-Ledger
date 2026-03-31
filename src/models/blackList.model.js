const mongoose = require('mongoose');

const blackListSchema = new mongoose.Schema({
    token : {
        type : String,
        required : [true, "Token is required to blacklist"],
        unique : true,
    
    }
},{
     timestamps : true
})

blackListSchema.index({createdAt : 1}, {expireAfterSeconds : 60*60*24*3})

const blackListModel = mongoose.model("blackList", blackListSchema)
module.exports = blackListModel