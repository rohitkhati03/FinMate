import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name:{type: String, required: true, trim: true},
    description:{type: String, defualt:''},
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    members:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    emoji:{type: String, default:'👥'}
},{timestamps: true});

export default mongoose.model('Group', groupSchema);