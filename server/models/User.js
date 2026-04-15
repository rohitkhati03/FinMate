import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type: String, required:true, unique:true, lowercase:true},
    password:{type:String, required:true, minlength:8},
    phone:{type:String, required: true},
    avatar:{type: String, default:''},
    currency:{type: String, default:'INR'},
    isVerified:{type:Boolean, default:false},
    otp:{type:String},
    otpExpiry:{type:Date}
   
}, {timestamps:true});

export default mongoose.model('User', userSchema);
