import  express  from "express";
import dotenv from "dotenv"
import { connection } from "./config/db.js";
import Route from "./route/router.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import { errormiddelware } from "./Middleware/Error.js";
const app = express()
let port = 3000;
dotenv.config()

// database connection 
connection()

//middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//Route
app.use(Route)
//custom middlerare 
app.use(errormiddelware)


    





app.listen(port,()=>{
    console.log("server is ruinning on this port",port);
})
