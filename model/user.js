import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
const user = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase : true,
        unique:true,
        validate :{
            validator : validator.isEmail,
            message  : "Invalid email address"
        }
    },
    password : {
        type : String,
        required :true,
        unique : [true,"Duplucate password!!!"]
    },
    address : {
        type : String,
        required : true,
    },
    refreshtoken : {
        type : String
    }
},{timestamps:true})

user.pre("save", async function(next){
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password,10)
    }
})

export const userModel = mongoose.model("user",user)