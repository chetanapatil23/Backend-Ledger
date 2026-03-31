const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required for creating a user"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid Email address"],
        unique:[true,"Email already exists."]
    },
    name:{
        type:String,
        required:[true,"Name is required for creating an account"]
    },
    password:{
        type:String,
        required:[true,"Password is required for creating an account"],
        minlength:[6,"Password must be at least 6 characters long"],
        select:false  //select false is liye used kiya hai kiyuki in case in ftucture hum aage data prin karvaye to password na aye jab hum bole tab hi print ho
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true, //immutable is liye used kiya hai ki system user ko change na kar sake koi bhi user
        select:false //system user ka data print nahi karana hai to select false use karte hai
    }
},{
    timestamps:true //user kab creat hua tha,user ka data kab update hua tha last time ye dono chize defined karata hai
})

userSchema.pre("save",async function(){    //jab bhi hum data save karage us se pahele ye function chalega
      if(!this.isModified("password")) {       //user ka pssword change huaa ho to use hash me convert karna hai
        return 
      } 
      
     const hash = await bcrypt.hash(this.password,10)
     this.password = hash
     return
})

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password,this.password)            //bcrypt.compare agar password compare hua teru nahi to false return karati hai
}

const userModel = mongoose.model("user",userSchema)
module.exports = userModel;
