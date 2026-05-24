import mongoose from "mongoose";

export const connection = async()=>{
    console.time("start here")
    await mongoose.connect(process.env.MONGO_URL)
    // console.timeEnd("connection end here")
    .then(()=>console.log("database is connected"))
    .catch((err)=>console.log(err))
}