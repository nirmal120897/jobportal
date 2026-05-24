export const  errormiddelware = async(err,req,res,next)=>{
    console.log(err);
    return res.status(400).json({
        sucess: false,
        err : err.message
    })
}