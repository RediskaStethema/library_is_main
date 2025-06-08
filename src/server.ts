import express from "express"
import {database, service_, SOCKET} from "./config_files/port_socket.js";
import {errHandl} from "./errors/errHandl.js";
import {LibraryRouter} from "./routers/librauter.js";
import morgan from "morgan";
import * as fs from "node:fs";
import * as mongoose from "mongoose";
import dotenv from "dotenv";
import {authet, skiprouts} from "./utils/autantification/autent.js";
import {pathroles, skipRouts} from "./utils/tools.js";
import {authorize} from "./utils/autantification/authorize.js";

export const launchServer = () => {
    // loadenv
dotenv.config();
    mongoose.connect(database).then(()=>{
     console.log(`data base connected with mongo`)
    }).catch(err=>{
        console.log(`data base not connected with mongo ${err}`)
   })
   const logStream=fs.createWriteStream("./src/access.log", {flags:'a'});
    const app=express()
    app.listen(process.env.PORT, () => {
        console.log(SOCKET)
    })

    //middleware
    app.use(express.json())
    app.use(authet(service_))
    app.use(skiprouts(skipRouts) as express.RequestHandler )
    app.use(authorize(pathroles))
    app.use(morgan("dev"));
    app.use(morgan('combined',{stream:logStream}))

    //router
    app.use("/api", LibraryRouter)
    // error handler
    app.use(errHandl)

}