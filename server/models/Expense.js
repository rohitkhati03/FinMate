import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    amount:{type:Number, required:true, min:0},
    category:{
        type:String,
        enum:['Food', 'Transport', 'Clothing', 'Outing', 'Groceries','Entertainmnet', 'Health', 'Miscellaneous'],
        require:true
    },
    note:{type: String, trim: true, default:''},
    date:{type:Date, default: Date.now}
}, {timestamps:true});

export default mongoose.model('Expense', expenseSchema);
