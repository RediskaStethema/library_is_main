var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { converbookDTO, convertBookToBookDto, convetStringto_toGENRE, getStatus } from "../utils/tools.js";
import { service_mongo_lib } from "../config_files/port_socket.js";
export class BookControler {
    constructor() {
        this.bookserv = service_mongo_lib;
    }
    getallbooks() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bookserv.getALlbooks();
        });
    }
    addBook(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = converbookDTO(dto);
            console.log(book);
            const result = yield this.bookserv.addbook(book);
            if (result) {
                console.log(book);
                return book;
            }
            throw new Error(JSON.stringify({ number: 403, message: `Book Name=${book.title} ID=${book.id} not added` }));
        });
    }
    removeBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield this.bookserv.removebook(id);
            if (!book)
                throw Error(`Book with id ${id} not found and not  removed`);
            return convertBookToBookDto(book);
        });
    }
    getbyGenre(genre) {
        return __awaiter(this, void 0, void 0, function* () {
            const Genre = convetStringto_toGENRE(genre);
            if (!Genre)
                throw Error(`Book with ${genre} not found`);
            return yield this.bookserv.getbyhenre(Genre);
        });
    }
    pickUp(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bookserv.pickUP(id);
        });
    }
    returnbook(id, reader) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bookserv.returnbook(id, reader);
        });
    }
    getBooksBySTatusAndGenre(genre, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const Genre = convetStringto_toGENRE(genre);
            const Status = getStatus(status);
            return yield this.bookserv.getBookSatusGenre(Genre, Status);
        });
    }
    getbookbyID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bookserv.getbookbyID(id);
        });
    }
}
