import {Libserv, Reader_Interface} from "../libserv.js";
import {book, Genres, Role, StatusBook} from "../../model/book.js";
import {pool} from "../../config_files/port_socket.js";
import {Error} from "mongoose";
import {Reader} from "../../model/reader_type.js";
import {date} from "joi";

export class NewService_sql_imbd_impl implements Libserv, Reader_Interface {

    async addbook(book: book): Promise<boolean> {
       const [result]=  await pool.query('INSERT INTO books VALUES(null,?,?,?,?,?)',[book.id,book.title,book.author,book.genre,book.status ])
if (!result) return Promise.resolve(false);
    return Promise.resolve(true);
    }

    async getALlbooks(): Promise<book[]> {
        const [result] =await  pool.query('SELECT * FROM books');
        return Promise.resolve(result as unknown as book[]);
    }

    async getBookSatusGenre(genre: Genres, status: StatusBook): Promise<book[]> {
        const [result] = await pool.query('SELECT * FROM books WHERE genre=? AND status=?', [genre as string, status as string]);
        if (!result) throw new Error(`problem with result=genre: ${result}`);
        return Promise.resolve(result as unknown as book[]);
    }

    async getbyhenre(genre: Genres): Promise<book[]> {
        const [result] = await pool.query('SELECT * FROM books WHERE genre = ?', [genre]);
        if (!result) throw new Error(`problem with result=genre: ${result}`);
        return Promise.resolve(result as unknown as book[]);
    }

    async pickUP(id: string): Promise<void> {
        const result = await pool.query('UPDATE books SET status=? WHERE book_id=?', ['on_hand', id])
        if (!result) throw new Error(`Book with id ${id} not found`);
        Promise.resolve(`Book with id=${id} on hand`);
    }

    async removebook(id: string): Promise<book> {
        const [result] = await pool.query('DELETE FROM books WHERE book_id=?', [id]);
        if (!result) throw new Error(`Book with id ${id} not found`);
        return Promise.resolve(result as unknown as book);
    }

    async returnbook(id: string, reader: string): Promise<void> {
        const [result] = await pool.query('UPDATE books SET status=? WHERE book_id=?', ['on_stock',id])
        if (!result) throw new Error(`Book with id ${id} not found`);

    }

   async GetAllaboutReader(id: number): Promise<Reader> {

       const [result] = await pool.query(`SELECT created_at AS Dates, book_id AS BOOKS 
FROM readers_to_books 
WHERE reader_id = ? 
ORDER BY created_at ASC;`, [id])
       console.log(result)

       return Promise.resolve(result as unknown as Reader);
    }

    async getReadersbooks(reader_id: number): Promise<book[]> {
        const [result] = await pool.query('SELECT book_id FROM readers_to_books WHERE reader_id=? ', [reader_id]);
        const booksid= (result as any[]).map(r => r.book_id) as string[];
        console.log(booksid)
       let books:book[]=[]
 for (let i = 0; i < booksid.length; i++){
     const book= await this.getbookById(booksid[i]);
     books.push(book)
 }
        return Promise.resolve(books);
    }

   async getbookById(id: string) {
       const [book]=  await pool.query(`SELECT * FROM books WHERE book_id=?`,[id])
       if (!book) throw new Error(`Book with id ${id} not found`);
return Promise.resolve(book as unknown as book);
    }

    createNewreader(reader:Reader): void {
       const date=reader.date.toISOString().slice(0, 10)
        const result=pool.query(`INSERT INTO readers_to_books VALUES(null,?,?,?,?)`,[reader.id,date,`NEW_READER`, reader.lastname]);
    Promise.resolve(`Reader ${reader.lastname} with ${reader.id} registered`)
    }

    async givebookToreader(reader_id:number, id_book: string): Promise<boolean> {
const [row]=await pool.query(`SELECT * FROM readers_to_books WHERE reader_id=? AND book_id=? `, [reader_id, `NEW_READER`]);
        console.log(row)
const reader= (row as any[])[0]
        console.log(reader)
        console.log('reader.id:', reader.id)
       if(!reader) throw new Error(`problem with Reader in method`);
        const date = new Date().toISOString().slice(0, 10);
        const result= await pool.query(`INSERT INTO readers_to_books VALUES(null,?,?,?,?)`, [reader.reader_id,date,id_book,reader.Lastname])
if (!result) throw new Error(`woops we have a problem with id ${id_book} or Reader`);

return Promise.resolve(true);
    }

    async Add_newadmin(admin:Reader){
        const result=pool.query(`INSERT INTO readers_to_books VALUES(null,?,?,?,?)`,[admin.id,admin.date.toDateString().slice(0, 10),`ADMIN`, admin.lastname]);
        Promise.resolve(`Reader ${admin.lastname} with ${admin.id} registered`)
    }

    getbookbyID(id: string): Promise<book> {
        throw new Error(`no books `)
    }

    getAccount(email: string): Promise<Reader> {
        throw new Error( ` gjfkdgnlkd`)
    }

    removeReader(username: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    updateReader(reader: Reader): Promise<boolean> {
        return Promise.resolve(false);
    }

    updateRole(email: string, role: Role[]): Promise<Reader> {
     throw new Error( ` gjfkdgnlkd`)
    }

    GetALlreadarsOFbook(id_book: string): Promise<{ Who_read_now: Reader[]; Who_readed: Reader[] }> {
        return Promise.resolve({Who_read_now: [], Who_readed: []});
    }

    getaccby_book(bookname: string): Promise<Reader[]> {
        return Promise.resolve([]);
    }


}