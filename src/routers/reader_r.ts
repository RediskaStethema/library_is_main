import express from "express";
import {Reader_control} from "../controlerts/control_readers.js";
import asyncHundler from "express-async-handler";
import {readerDTOschema} from "../utils/joischems.js";
import {controller} from "./booksR.js";
import {Role} from "../model/book.js";
import {authreq} from "../utils/tools.js";

export const ReaderRouter=express.Router();
export const contooler_reader=new Reader_control()

ReaderRouter.post("/",asyncHundler(async (req,res)=>{
    const reader = req.body;
    const { error } = readerDTOschema.validate(reader);
    if (error) {
        res.status(400).json({ message: error.message });
        return;
    }

    const result = await contooler_reader.postnewreader(reader);
    res.status(201).json(result);
}))
ReaderRouter.patch("/gavebook",asyncHundler(async (req,res)=>{
    const reader=req.body
    const result=await contooler_reader.gavebook(reader.id, reader.books);
    res.type("application/json").json(result);
}))

ReaderRouter.get('/allreadersbooks', asyncHundler(async (req, res) => {
    const id = Number(req.query.id);
    if (isNaN(id)) {
        throw new Error('Invalid reader id');
    }
    const result = await contooler_reader.readersbooks(id);

    if (!result) {
        throw new Error('No books found for this reader');
    }
    res.json(result);
}));
ReaderRouter.get('/all_about_readers', asyncHundler(async (req, res) => {
    const id = Number(req.query.id);
    if (isNaN(id)) {
        throw new Error('Invalid reader id');
    }
    const result = await contooler_reader.allabout(id);

    if (!result) {
        throw new Error('No books found for this reader');
    }
    res.json(result);
}));
ReaderRouter.get('/bymail', asyncHundler(async (req, res) => {
    const reader = await contooler_reader.getAccount(req.body.mail as string);
    res.json(reader);
}));


ReaderRouter.patch('/updaterole', asyncHundler(async (req:authreq,res)=>{
    const role=req.body.role as Role[];
    const user=req.body.email as string;
    if (!role||!user) throw new Error(JSON.stringify(`Wrong email or Role`));
    const result= await  contooler_reader.updateRole(user, role);
    res.type("application/json").json(result);
}))


ReaderRouter.get('/readers_of_book', asyncHundler(async (req,res)=>{
    const books_id=req.body.id as string;
    if (!books_id) throw new Error(JSON.stringify(`Wrong books id`));
    const result= await  contooler_reader.Get_all_readers_of_book(books_id);
    res.type("application/json").json(result);
}))