var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StatusBook } from "../../model/book.js";
import { bookmodel } from "../../model/schema_mongo.js";
export class MongoClient {
    addbook(book) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield bookmodel.findOne({ id: book.id });
            if (isExist)
                return Promise.resolve(false);
            const book_doc = new bookmodel(book);
            yield book_doc.save();
            return Promise.resolve(true);
        });
    }
    getALlbooks() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(yield bookmodel.find({}));
        });
    }
    getbyhenre(genre) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(yield bookmodel.find({ genre }));
        });
    }
    pickUP(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield bookmodel.findOne({ id });
            if (!book)
                throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));
            if (book.status !== StatusBook.ON_STOCK)
                throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));
            book.status = StatusBook.ON_HAND;
            book.save();
        });
    }
    removebook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield bookmodel.findOneAndDelete({ id });
            if (!book)
                throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));
            return book;
        });
    }
    returnbook(id, reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield bookmodel.findOne({ id });
            if (!book)
                throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));
            book.status = StatusBook.ON_STOCK;
            book.picklist.push({ reader: `Reader:${reader} returned book`, date: new Date().toDateString() });
            book.save();
        });
    }
    getBookSatusGenre(genre, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield bookmodel.find({ genre, status });
            return Promise.resolve(result);
        });
    }
    getbookbyID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id);
            const result = yield bookmodel.findOne({ id: id });
            if (!result) {
                console.log(result);
                throw new Error('Book not found');
            }
            return result.toObject();
        });
    }
}
