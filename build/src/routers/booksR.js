var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { BookControler } from "../controlerts/control.js";
import asyncHundler from "express-async-handler";
import { bookidSchema, bookSchemaDto, bookSchemareader } from "../utils/joischems.js";
export const booksRouter = express.Router();
export const controller = new BookControler();
booksRouter.get("/", asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield controller.getallbooks();
    res.type("application/json").json(result);
})));
booksRouter.post("/", asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dto = req.body;
    const { error } = bookSchemaDto.validate(dto);
    if (error)
        throw new Error(JSON.stringify({ number: 400, message: error.message }));
    const result = yield controller.addBook(dto);
    res.type("application/json").json(result);
})));
booksRouter.get('/genre', asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield controller.getbyGenre(req.query.genre);
    res.type("application/json").json(result);
})));
booksRouter.put('/pick_up', asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    let { error } = bookSchemaDto.validate(id);
    if (error)
        throw new Error(JSON.stringify({ number: 400, message: `Wrong ID error: ${error.message}` }));
    yield controller.pickUp(id);
    res.send(`book picked up`);
})));
booksRouter.delete("/", asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    let { error } = bookidSchema.validate(id);
    if (error)
        throw new Error(JSON.stringify({ number: 400, message: error.message }));
    const result = yield controller.removeBook(id);
    res.type('application/json').json(result);
    res.send(`book with id ${id} was deleted`);
})));
booksRouter.put("/return", asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    let { error } = bookidSchema.validate(id);
    if (error)
        throw new Error(JSON.stringify({ number: 400, message: error.message }));
    const { reader } = req.body;
    error = bookSchemareader.validate(reader).error;
    if (error)
        throw new Error(JSON.stringify({ number: 400, message: error.message }));
    yield controller.returnbook(id, reader);
    res.send(`Book with id=${id} was returned by reader ${reader}`);
})));
booksRouter.get('/genre/status', asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { genre, status } = req.query;
    const rs = yield controller.getBooksBySTatusAndGenre(genre, status);
    res.type("application/json").json(rs);
})));
booksRouter.get('/book_byID', asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id_book;
    console.log(id);
    const result = yield controller.getbookbyID(id);
    res.type("application/json").json(result);
})));
