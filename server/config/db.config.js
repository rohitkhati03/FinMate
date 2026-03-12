import mongoose from "mongoose";
const connect = async ()=>{
    try {
       const conn = await mongoose.connect(process.env.MONGO_URI);
         console.log(`MongoDB connected: ${conn.connection.host}`);
     } catch (error) {
       console.log(`Unable to establish connection ${error}`);
       process.exit(1);
     }
}

export default connect;