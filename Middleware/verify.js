import jwt from "jsonwebtoken"
import { userModel } from "../model/user.js";
import mongoose from "mongoose";

export const verify =async(req,res,next)=>{
    let token = req.cookies.token;
    if (token) {
        let verification = jwt.verify(token,process.env.SECRET_KEY)
        console.log(verification);
        
        let currenyuser = await userModel.aggregate([
            {
                $match : {
                    _id : new mongoose.Types.ObjectId(verification.id)
                }
            },
            {
                $project : {
                    password : 0,
                    refreshtoken : 0
                }
            }
        ])

        console.log(currenyuser);
        req.user = currenyuser
        next();
    }else{
      
        let refreshtoken = req.cookies.refreshtoken;

        if (!refreshtoken) {
            return next({message : "Unathorized!!!"})
        }

        let verificationoftoken = jwt.verify(refreshtoken , process.env.SECRET_KEY)

        let currentuser = await userModel.aggregate([
            {
                $match : {
                    _id : new mongoose.Types.ObjectId(verificationoftoken.id) 
                }
            },
            {
                $project : {
                    password : 0,
                    refreshtoken :0
                }
            }
        ])

        //generate again the  token 
        let option = {
            httpOnly : true,
            maxAge : 15 * 60 * 1000
        }

        let option1 = {
            httpOnly : true,
            maxAge : 20 * 60 * 1000
        }
   
        let refreshtokennew = jwt.sign(
            {id :currentuser[0]._id },
            process.env.SECRET_KEY
        )
        
        let newtoken = jwt.sign(
            {
                id :currentuser[0]._id,
                name : currentuser[0].name
            },
            process.env.SECRET_KEY

        )
        await userModel.updateOne(
            {_id : new mongoose.Types.ObjectId(verificationoftoken.id)},
            {
                $set : {
                    refreshtoken : refreshtokennew
                }
            }
        )
        res
            .cookie('token',newtoken,option)
            .cookie('refreshtoken',refreshtokennew,option1)

         req.user =  currentuser
         next()
    }
}







