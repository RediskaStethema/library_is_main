var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { bookmodel, reader_model } from "../../model/schema_mongo.js";
import { Error } from "mongoose";
import { service_mongo_lib } from "../../config_files/port_socket.js";
export class Mongo_reader_imbd_impl {
    constructor() {
        this.service = service_mongo_lib;
    }
    GetAllaboutReader(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = yield reader_model.findOne({ id });
            if (!reader) {
                throw new Error(`Reader with id ${id} not found`);
            }
            return reader;
        });
    }
    createNewreader(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const temp = yield reader_model.findOne({ id: reader.id });
            if (temp)
                throw new Error(`This reader exists`);
            const readerToSave = new reader_model(Object.assign(Object.assign({}, reader), { roles: `${reader.roles}` }));
            yield readerToSave.save();
            console.log(`Reader ${reader.email} created with USER role`);
        });
    }
    getReadersbooks(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const booksFromDb = yield bookmodel.find({ 'picklist.reader': id.toString() });
            const books = booksFromDb.map((doc) => ({
                id: doc.id,
                title: doc.title,
                author: doc.author,
                genre: doc.genre,
                status: doc.status,
                picklist: doc.picklist.map(entry => ({
                    date: entry.date,
                    reader: entry.reader,
                })),
            }));
            return books;
        });
    }
    getbookById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield bookmodel.findOne({ id });
            if (!result) {
                throw new Error(`Book with id ${id} not found`);
            }
            return {
                id: result.id,
                title: result.title,
                author: result.author,
                genre: result.genre,
                status: result.status,
                picklist: result.picklist.map(entry => ({
                    date: entry.date,
                    reader: entry.reader,
                }))
            };
        });
    }
    givebookToreader(reader, id_book) {
        return __awaiter(this, void 0, void 0, function* () {
            const readerID = reader;
            const give = yield bookmodel.updateOne({ id: id_book }, { $push: { picklist: { reader: readerID, date: new Date().toISOString(), } } });
            if (give) {
                this.service.pickUP(id_book);
                return true;
            }
            return false;
        });
    }
    removeReader(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield reader_model.findOneAndDelete({
                email: username
            });
            if (!result) {
                throw new Error(`problem with remove Reader `);
            }
            return Promise.resolve(true);
        });
    }
    updateReader(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield reader_model.findOneAndUpdate({ email: reader.email }, reader);
            if (!result) {
                throw new Error(`problem with updateReader `);
            }
            return Promise.resolve(true);
        });
    }
    updateRole(email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = role;
            const result = yield reader_model.findOneAndUpdate({ email }, { $set: { roles: role } });
            if (!result) {
                throw new Error(`problem with updateRole `);
            }
            return result;
        });
    }
    getAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield reader_model.findOne({ email });
            if (!result)
                throw new Error(`problem with getAccount `);
            return Promise.resolve(result);
        });
    }
    getaccby_book(bookname) {
        return __awaiter(this, void 0, void 0, function* () {
            const books = yield bookmodel.find({ title: bookname }).lean();
            const readerIds = books.flatMap(book => book.picklist.map(record => record.reader));
            const uniqueReaderIds = [...new Set(readerIds)];
            const readers = yield reader_model.find({ id: { $in: uniqueReaderIds } });
            if (!readers || readers.length === 0) {
                throw new Error(`No readers found for book "${bookname}"`);
            }
            return [readers];
        });
    }
    GetALlreadarsOFbook(id_book) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield this.getbookById(id_book);
                let arry_who_read = [];
                let arry_who_readed = [];
                console.log(book);
                book.picklist.map(entry => {
                    let x = entry.reader;
                    if (x.includes(`returned book`)) {
                        arry_who_readed.push(x);
                    }
                    else {
                        arry_who_read.push(x);
                    }
                });
                console.log(arry_who_read);
                console.log(arry_who_readed);
                let result_1 = yield Promise.all(arry_who_read.map(id => {
                    console.log(id);
                    let readerId = id.replace(/\D/g, "");
                    return this.GetAllaboutReader(readerId);
                }));
                let result_2 = yield Promise.all(arry_who_readed.map(id => {
                    let readerId = id.replace(/\D/g, "");
                    return this.GetAllaboutReader(readerId);
                }));
                console.log(result_1);
                console.log(result_2);
                let end = {
                    Who_read_now: result_1,
                    Who_readed: result_2
                };
                console.log(end);
                return end;
            }
            catch (e) {
                throw new Error(`Problem in function ${e}`);
            }
        });
    }
}
