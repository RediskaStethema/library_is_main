var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from "../../config_files/port_socket.js";
import { Error } from "mongoose";
export class NewService_sql_imbd_impl {
    addbook(book) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield pool.query('INSERT INTO books VALUES(null,?,?,?,?,?)', [book.id, book.title, book.author, book.genre, book.status]);
            if (!result)
                return Promise.resolve(false);
            return Promise.resolve(true);
        });
    }
    getALlbooks() {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield pool.query('SELECT * FROM books');
            return Promise.resolve(result);
        });
    }
    getBookSatusGenre(genre, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield pool.query('SELECT * FROM books WHERE genre=? AND status=?', [genre, status]);
            if (!result)
                throw new Error(`problem with result=genre: ${result}`);
            return Promise.resolve(result);
        });
    }
    getbyhenre(genre) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield pool.query('SELECT * FROM books WHERE genre = ?', [genre]);
            if (!result)
                throw new Error(`problem with result=genre: ${result}`);
            return Promise.resolve(result);
        });
    }
    pickUP(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield pool.query('UPDATE books SET status=? WHERE book_id=?', ['on_hand', id]);
            if (!result)
                throw new Error(`Book with id ${id} not found`);
            Promise.resolve(`Book with id=${id} on hand`);
        });
    }
    removebook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield pool.query('DELETE FROM books WHERE book_id=?', [id]);
            if (!result)
                throw new Error(`Book with id ${id} not found`);
            return Promise.resolve(result);
        });
    }
    returnbook(id, reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield pool.query('UPDATE books SET status=? WHERE book_id=?', ['on_stock', id]);
            if (!result)
                throw new Error(`Book with id ${id} not found`);
        });
    }
    GetAllaboutReader(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield pool.query(`SELECT created_at AS Dates, book_id AS BOOKS 
FROM readers_to_books 
WHERE reader_id = ? 
ORDER BY created_at ASC;`, [id]);
            console.log(result);
            return Promise.resolve(result);
        });
    }
    getReadersbooks(reader_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield pool.query('SELECT book_id FROM readers_to_books WHERE reader_id=? ', [reader_id]);
            const booksid = result.map(r => r.book_id);
            console.log(booksid);
            let books = [];
            for (let i = 0; i < booksid.length; i++) {
                const book = yield this.getbookById(booksid[i]);
                books.push(book);
            }
            return Promise.resolve(books);
        });
    }
    getbookById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [book] = yield pool.query(`SELECT * FROM books WHERE book_id=?`, [id]);
            if (!book)
                throw new Error(`Book with id ${id} not found`);
            return Promise.resolve(book);
        });
    }
    createNewreader(reader) {
        const date = reader.date.toISOString().slice(0, 10);
        const result = pool.query(`INSERT INTO readers_to_books VALUES(null,?,?,?,?)`, [reader.id, date, `NEW_READER`, reader.lastname]);
        Promise.resolve(`Reader ${reader.lastname} with ${reader.id} registered`);
    }
    givebookToreader(reader_id, id_book) {
        return __awaiter(this, void 0, void 0, function* () {
            const [row] = yield pool.query(`SELECT * FROM readers_to_books WHERE reader_id=? AND book_id=? `, [reader_id, `NEW_READER`]);
            console.log(row);
            const reader = row[0];
            console.log(reader);
            console.log('reader.id:', reader.id);
            if (!reader)
                throw new Error(`problem with Reader in method`);
            const date = new Date().toISOString().slice(0, 10);
            const result = yield pool.query(`INSERT INTO readers_to_books VALUES(null,?,?,?,?)`, [reader.reader_id, date, id_book, reader.Lastname]);
            if (!result)
                throw new Error(`woops we have a problem with id ${id_book} or Reader`);
            return Promise.resolve(true);
        });
    }
    Add_newadmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = pool.query(`INSERT INTO readers_to_books VALUES(null,?,?,?,?)`, [admin.id, admin.date.toDateString().slice(0, 10), `ADMIN`, admin.lastname]);
            Promise.resolve(`Reader ${admin.lastname} with ${admin.id} registered`);
        });
    }
    getbookbyID(id) {
        throw new Error(`no books `);
    }
    getAccount(email) {
        throw new Error(` gjfkdgnlkd`);
    }
    removeReader(username) {
        return Promise.resolve(false);
    }
    updateReader(reader) {
        return Promise.resolve(false);
    }
    updateRole(email, role) {
        throw new Error(` gjfkdgnlkd`);
    }
    GetALlreadarsOFbook(id_book) {
        return Promise.resolve({ Who_read_now: [], Who_readed: [] });
    }
    getaccby_book(bookname) {
        return Promise.resolve([]);
    }
}
