import mongoose from "mongoose";

export const connectionDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`connected to MongoDB ${conn.connection.host}`);
    } catch (error){

    console.log("failed to connect MongoDB",error)
process.exit(1);
}
};