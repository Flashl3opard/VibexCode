
import mongoose from "mongoose";
const DB_URI = process.env.MONGODB_URI;
if (!DB_URI){

    throw new Error ("Please define mongo environment in env local")
}

async function connectDB() {
    if (mongoose.connection.readyState===1 ) {
        return mongoose;
    }
    const opts =  {
        bufferCommands: false,       
    }
    await mongoose.connect(DB_URI!,opts);
    return mongoose;
}

export default connectDB