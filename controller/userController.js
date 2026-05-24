import { userModel } from "../model/user.js";
import jwt  from "jsonwebtoken"
import bcrypt from "bcrypt"

export const Register = async(req,res,next)=>{
    try {
        const { name , email, password, address} = req.body;
        if (!name || name==""){
            return next({message : "Please provide the name !!!"})
        } 
        if (!email || email=="") {
            return next({message : "Please provide the email !!!"})
        }
        if (!password || password=="") {
            return next({message : "Please provide the password !!!"})
        }
        if (!address || address=="") {
            return next({message : "Please provide the address !!!"})
        }

        let isuseExit = await userModel.aggregate([
            {
                $match : {
                    email : email
                }
            }
        ])
        
        if (isuseExit.length!==0) {
           return next("user is already available!!!!")
        }
        
        let adddata = await userModel.create(req.body)
        
        return res
                .status(200)
                .json({message : "Registration Done successfully!!!"})
                
        
    } catch (error) {
    next(error)
    }
};

export const login = async(req,res,next)=>{
    try {
        const {password , email} = req.body;

        if (!password || password == "") {
          return next({message : "Please Provide the password"})
        }
        if (!email || email ==undefined) {
          return next({message :"Please Provide the email"})
        }
       
        // check wheather use is availble or not 
        let EnteredUser = await userModel.aggregate([
            {
                $match : {
                    email : email
                }
            }
        ])
         
        console.log("Entered user here",EnteredUser);

        if (EnteredUser.length!==1) {
            next({message :"User is not Found Please Register first!!!"});
        }

        let databasepassword = EnteredUser[0].password

        //check password is correct or not
        let iscorrectpass = await bcrypt.compare(password ,databasepassword)
       
        console.log("password is correct?",iscorrectpass);

        if (iscorrectpass) {
             //Generate the token here
        let token = jwt.sign({
            id : EnteredUser[0]._id,
            name : EnteredUser[0].name
            },process.env.SECRET_KEY)
        
        let refreshtoken = jwt.sign({
            id : EnteredUser[0]._id,
            },process.env.SECRET_KEY)   
           
            // store the refreshtoken in the database here

         await userModel.findByIdAndUpdate(
            {
                _id : EnteredUser[0]._id
            },
            {
                refreshtoken : refreshtoken
            }
         )
        
        let option ={
            httpOnly :  true,
            maxAge : 15 * 60 * 1000
        }

        let option1 ={
            httpOnly :  true,
            maxAge : 20 * 60 * 1000
        }

        return  res
                    .cookie('token',token,option)
                    .cookie('refreshtoken',refreshtoken,option1)
                    .status(200)
                    .json({message : "Login Succesfully!!!"})

        }else{
            next({message: "Password or username is incorrect!!!"})
        }
        
    } catch (error) {
        next(error)
    }
}

export const updateUser = async(req,res,next)=>{
    try {
        const {email,name,password,address} = req.body;
        console.log("====>",req.user[0].email);
        const updateuser = await userModel.findByIdAndUpdate({_id : req.user[0]._id},req.body)
        console.log(updateuser);

        if (updateUser) {
          return res.status(200).json({message : "User is updated succesfully!!!"})   
        }

    } catch (error) {
        next(error)
    }
}

export const changepassword = async(req,res,next)=>{
    try {
        const {oldpassword, changepassword ,newpassword} = req.body;
        if (!oldpassword || oldpassword =="" || oldpassword == undefined) {
           return next({message : "Please provide the oldpassword here!!"})            
        }
        if (!newpassword || newpassword =="" || newpassword==undefined) {
            return next({message : "Please provide the oldpassword here!!"})            
        }
        if (!changepassword || changepassword =="" || changepassword == undefined) {
            return next({message : "Please provide the oldpassword here!!"})            
        }

        if (newpassword !== changepassword) {
         return next({message : "Please Enter the correct newpassword!!"})   
        }

        let currentuser = req.user[0]

        //check if old password is right or not
        
        let databasepassword = await userModel.find({email : currentuser.email})

        
        let comparethepass = bcrypt.compare(oldpassword,databasepassword[0].password)

        if (comparethepass) {
          let hasnewpass = await bcrypt.hash(newpassword,10)  
          let updatethepass =   await userModel.findByIdAndUpdate({_id : currentuser._id},{password : hasnewpass })
          return res.status(200).json({message : "User update succcessfullyy!!!"})
        }

    } catch (error) {
        next(error)
    }
}

export const logout = async(req,res,next) => {
    try {

        let userid = req.user[0]._id;

        await userModel.findByIdAndUpdate(
            {_id : userid},
            {refreshtoken : ""}
        )
        
        return res.clearCookie("refreshtoken").clearCookie("token").json({message : "Logout sucessfully!!!"})
    } catch (error) {
        next(error)
        
    }
}