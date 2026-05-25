import mongoose from "mongoose";

export const connection = async () => {
  console.time("start here");
  try {
    console.log(">>>herer", process.env.MONGO_URL);

    await mongoose.connect(process.env.MONGO_URL);
    console.log(">>>connected succesfully db!!!");

    // console.timeEnd("connection end here")
    // .then(()=>console.log("database is connected"))
    // .catch((err)=>console.log(err))
  } catch (error) {
    console.log("....error", error.message);
  }
};
