import express, { Router } from "express";
import { Register,changepassword,login,logout,updateUser } from "../controller/userController.js";
import { verify } from "../Middleware/verify.js";
import { alljob, deletejob, storejob, updatejob } from "../controller/jobcontroller.js";
const Route = express.Router()


//user router 
Route.post("/register",Register)
Route.post("/login", login)
Route.post("/updateUser",verify,updateUser)
Route.post("/changepassword",verify,changepassword)
Route.post("/logout",verify,logout)
Route.post("/addJob",verify,storejob)
Route.get("/alljob",verify,alljob)
Route.post("/deletejob",verify,deletejob)
Route.post("/updatejob",verify,updatejob)






export default Route;