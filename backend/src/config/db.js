import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
    }catch(err){
        console.error("Error: ", err);
        process.exit(1)
    }
}