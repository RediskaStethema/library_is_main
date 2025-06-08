import express from "express";
import { booksRouter } from "./booksR.js";
import { ReaderRouter } from "./reader_r.js";
export const LibraryRouter = express.Router();
LibraryRouter.use('/books', booksRouter);
LibraryRouter.use('/readers', ReaderRouter);
