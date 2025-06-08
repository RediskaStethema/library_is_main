var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StatusBook } from "../model/book.js";
import { Error } from "mongoose";
export class library_ServiceimplemEmbd {
    constructor() {
        this.books = [];
    }
    addbook(book) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.books.findIndex(item => item.id === book.id);
            if (index === -1) {
                this.books.push(book);
                console.log(`book ${book.title} is added`);
                return new Promise((res) => { res(true); });
            }
            return new Promise((res) => { res(false); });
        });
    }
    getALlbooks() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.books.length === 0) {
                console.log(' array of books is empty');
            }
            return Promise.resolve([...this.books]);
        });
    }
    getbyhenre(genre) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.books.length === 0) {
                console.log(' array of books is empty');
                return this.books;
            }
            return Promise.resolve(this.books.filter(book => book.genre === genre));
        });
    }
    pickUP(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.books.findIndex(book => book.id === id);
            if (index === -1)
                throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));
            const pick_up = this.books[index];
            pick_up.status = StatusBook.ON_HAND;
            console.log(`${pick_up.title} on hand`);
        });
    }
    removebook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.books.findIndex(book => book.id === id);
            if (index === -1)
                throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));
            const removed = this.books[index];
            removed.status = StatusBook.REMOVED;
            console.log(`${removed.title} removed`);
            return Promise.resolve(removed);
        });
    }
    returnbook(id, reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.books.findIndex(book => book.id === id);
            if (index === -1)
                throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));
            const book = this.books[index];
            if (book.status !== StatusBook.ON_HAND)
                throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));
            book.status = StatusBook.ON_STOCK;
            book.picklist.push({ reader, date: new Date().toDateString() });
            console.log(`${book.title} on stock`);
        });
    }
    getBookSatusGenre(genre, status) {
        return Promise.resolve([]);
    }
    getbookbyID(id) {
        throw new Error(`Book with id ${id} not found`);
    }
}
