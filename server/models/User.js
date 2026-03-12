import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type: String, required:true, unique:true, lowercase:true},
    password:{type:String, required:true, minlength:8},
    avatar:{type: String, degault:''},
    currency:{type: String, default:'INR'}
   
}, {timestamps:true});

export default mongoose.model('User', userSchema);
