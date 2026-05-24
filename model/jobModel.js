import mongoose from "mongoose";

const job = new mongoose.Schema({
    jobposition : {
        type : String,
        required :true
    },
    location : {
         type : String,
         required :true
    },
    company:{
        type : String,
        required : [true , "Please Enter the company name!!!"],
        maxLength : 10
    },
    status : {
        type : String,
        enum :["Reject","Pending","interview"]
    }

},{timestamps : true})

export const jobModel = new mongoose.model("jobs",job)