import mongoose from "mongoose";
import {Genres, Role, StatusBook} from "./book.js";

const bookmongo= new mongoose.Schema({
    id: {type:String, required:true},
    title: {type:String, required:true},
    author: {type:String, required:true},
    genre: {type:String, enum:Genres,  required:true},
    status: {type:String, enum:StatusBook, required:true},
    picklist: {type:[{reader:{type:String}, date:{type:String}}] },
})

const Reader_schema= new mongoose.Schema({
    id:{type:String, required: true},
    email:{type:String, required: true},
    passHash:{type:String, required: true},
    birthdate:{type:String, required: true},
    roles:{type:[String], enum: Role, required: true}
}, {versionKey:false})

export const bookmodel= mongoose.model("Library_book",bookmongo, 'books_collection');
export const reader_model=mongoose.model('Reader', Reader_schema, 'readers_collection')

