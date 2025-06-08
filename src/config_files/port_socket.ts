import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import {Mongo_reader_imbd_impl} from "../services/mongoose_DB/mongo_reader_imbd.js";
import {MongoClient} from "../services/mongoose_DB/lib_service_implementation_mongo.js";
export const PORT=3055
dotenv.config()
export const password=process.env.PSWORD as string
export const database=`mongodb+srv://daniildavinchi:owHKlhRoYXeFNyoc@cluster0.fj5mlis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
export const SOCKET=`started at http://localhost:${process.env.PORT}`
export const pool =mysql.createPool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT? +process.env.DB_PORT:undefined,
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD
})
export const service_mongo_lib=new MongoClient
export const service_=new Mongo_reader_imbd_impl
