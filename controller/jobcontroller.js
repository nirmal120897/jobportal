import { jobModel } from "../model/jobModel.js"


export const storejob = async(req,res,next)=>{
    try {
        const {jobposition,location,company,status} = req.body;

        if ([jobposition,location,company,status].some((ele)=> ele ==""|| undefined)) {
            return next({message : "Please provide all va;ue!!!"})
        }
        const addjob = await jobModel.create(req.body)
         if (addjob) {
            res.send("add successfully!!!")
         }
    } catch (error) {
        next(error)
    }
}

export const alljob = async(req,res,next)=>{
    try {
        const alljob = await jobModel.find()

        return res
                 .status(200)
                 .json({
                    message : "Data found sucessfully!!!",
                    data : alljob                 
                 })
    } catch (error) {
        next(error)
    }
}

export const deletejob = async(req,res,next)=>{
    try {
        const jobid = req.query.id
        const deletejob = await jobModel.findByIdAndDelete({_id : jobid})
        if (deletejob) {
            return res.status(200).json({message : "Deleted succesfully@!!!"})
        }
    } catch (error) {
        next(error)
    }
}

export const updatejob = async(req,res,next)=>{
    try {
        const jobid = req.query.id
        console.log(jobid);
        const deletejob = await jobModel.findByIdAndUpdate({_id : jobid},req.body)
        if (deletejob) {
            return res.status(200).json({message : "Updated  succesfully@!!!"})
        }
    } catch (error) {
        next(error)
    }
}