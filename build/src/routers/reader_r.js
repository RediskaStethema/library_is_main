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
import { Reader_control } from "../controlerts/control_readers.js";
import asyncHundler from "express-async-handler";
import { readerDTOschema } from "../utils/joischems.js";
export const ReaderRouter = express.Router();
export const contooler_reader = new Reader_control();
ReaderRouter.post("/", asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reader = req.body;
    const { error } = readerDTOschema.validate(reader);
    if (error) {
        res.status(400).json({ message: error.message });
        return;
    }
    const result = yield contooler_reader.postnewreader(reader);
    res.status(201).json(result);
})));
ReaderRouter.patch("/gavebook", asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reader = req.body;
    const result = yield contooler_reader.gavebook(reader.id, reader.books);
    res.type("application/json").json(result);
})));
ReaderRouter.get('/allreadersbooks', asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.query.id);
    if (isNaN(id)) {
        throw new Error('Invalid reader id');
    }
    const result = yield contooler_reader.readersbooks(id);
    if (!result) {
        throw new Error('No books found for this reader');
    }
    res.json(result);
})));
ReaderRouter.get('/all_about_readers', asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.query.id);
    if (isNaN(id)) {
        throw new Error('Invalid reader id');
    }
    const result = yield contooler_reader.allabout(id);
    if (!result) {
        throw new Error('No books found for this reader');
    }
    res.json(result);
})));
ReaderRouter.get('/bymail', asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reader = yield contooler_reader.getAccount(req.body.mail);
    res.json(reader);
})));
ReaderRouter.patch('/updaterole', asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.body.role;
    const user = req.body.email;
    if (!role || !user)
        throw new Error(JSON.stringify(`Wrong email or Role`));
    const result = yield contooler_reader.updateRole(user, role);
    res.type("application/json").json(result);
})));
ReaderRouter.get('/readers_of_book', asyncHundler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books_id = req.body.id;
    if (!books_id)
        throw new Error(JSON.stringify(`Wrong books id`));
    const result = yield contooler_reader.Get_all_readers_of_book(books_id);
    res.type("application/json").json(result);
})));
