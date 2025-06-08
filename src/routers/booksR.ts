import express from "express";
import {BookControler} from "../controlerts/control.js";
import asyncHundler from "express-async-handler"
import {book} from "../model/book.js";
import {bookidSchema, bookSchemaDto, bookSchemareader} from "../utils/joischems.js";
import {bookDTO} from "../model/dtobook.js";
import {authreq} from "../utils/tools.js";



export const booksRouter=express.Router();
export const  controller= new BookControler()

booksRouter.get("/",asyncHundler(async (req,res)=>{
 const result:book[]=await controller.getallbooks()
    res.type("application/json").json(result);
}))
booksRouter.post("/",asyncHundler(async (req,res)=>{
    const dto=req.body;
    const {error}=bookSchemaDto.validate(dto);
    if(error) throw new Error(JSON.stringify({number:400, message:error.message}));
const result:book= await controller.addBook(dto as bookDTO);
res.type("application/json").json(result);
}))
booksRouter.get('/genre', asyncHundler(async (req,res)=>{
    const result=await controller.getbyGenre(req.query.genre as string);
    res.type("application/json").json(result);
}))
booksRouter.put('/pick_up', asyncHundler(async (req,res)=>{
    const id= req.query.id
    let {error}=bookSchemaDto.validate(id);
    if(error) throw new Error(JSON.stringify({number:400, message:`Wrong ID error: ${error.message}`}));
    await controller.pickUp(id as string);
res.send(`book picked up`);
}))
booksRouter.delete("/",asyncHundler(async (req,res)=>{
const id =req.query.id
    let {error}=bookidSchema.validate(id);
if(error) throw new Error(JSON.stringify({number:400, message:error.message}));
const result = await controller.removeBook(id as string);
res.type('application/json').json(result);
res.send(`book with id ${id as string} was deleted`);

}))
booksRouter.put("/return",asyncHundler(async (req,res)=>{
    const id=req.query.id as string
    let {error}=bookidSchema.validate(id);
    if(error) throw new Error(JSON.stringify({number:400, message:error.message}));
    const{reader}=req.body

    error=bookSchemareader.validate(reader).error;
    if(error) throw new Error(JSON.stringify({number:400, message:error.message}));
   await controller.returnbook(id,reader as string)
    res.send(`Book with id=${id} was returned by reader ${reader}`);
}))
booksRouter.get('/genre/status', asyncHundler(async (req,res)=>{
const{genre, status}=req.query;
const rs:book[]=await controller.getBooksBySTatusAndGenre(genre as string,status as string)
    res.type("application/json").json(rs);
}))

booksRouter.get('/book_byID', asyncHundler(async (req:authreq,res)=>{
    const id=req.body.id_book as string
    console.log(id)
    const result=await controller.getbookbyID(id);
    res.type("application/json").json(result);

}))
