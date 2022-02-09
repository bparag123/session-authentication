import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from "validator";
import MyError from "../myError.js";

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : [true, "Please Provide Username"],
        unique: true
    },
    email : {
        type : String,
        required : [true, "Please Provide Email"],
        unique: true,
        validate:{
            validator: (value)=> validator.isEmail(value),
            message: (data) => `${data.value} is not valid Email`
        },
    },
    password:{
        type : String,
        required : [true, "Please Provide Username"]
    }
})

userSchema.methods.checkPassword = async function(password){
    let isMathed = await bcrypt.compare(password, this.password)
    return isMathed
}

userSchema.pre("save", async function(next){
    let hashedPasword = await bcrypt.hash(this.password,10)
    this.password = hashedPasword
    next()
})

export default mongoose.model("User", userSchema);