import {Reader_Interface} from "../libserv.js";
import {Reader} from "../../model/reader_type.js";
import {book, Genres, Role, StatusBook} from "../../model/book.js";
import {bookmodel, reader_model} from "../../model/schema_mongo.js";
import {Error} from "mongoose";
import {service_mongo_lib} from "../../config_files/port_socket.js";


export class Mongo_reader_imbd_impl implements Reader_Interface{
    private service=service_mongo_lib



    async GetAllaboutReader(id: number): Promise<Reader> {
        const reader = await reader_model.findOne({ id });
        if (!reader) {
            throw new Error(`Reader with id ${id} not found`);
        }
        return reader as unknown as Reader;
    }

    async createNewreader(reader: Reader): Promise<void> {
        const temp = await reader_model.findOne({ id: reader.id });
        if (temp) throw new Error(`This reader exists`);

        const readerToSave = new reader_model({
            ...reader,
            roles:`${reader.roles}`,
        });

        await readerToSave.save();

        console.log(`Reader ${reader.email} created with USER role`);
    }


    async getReadersbooks(id: number): Promise<book[]> {
        const booksFromDb = await bookmodel.find({ 'picklist.reader': id.toString() });
        const books: book[] = booksFromDb.map((doc) => ({
            id: doc.id as string,
            title: doc.title as string,
            author: doc.author as string,
            genre: doc.genre as Genres,
            status: doc.status as StatusBook,
            picklist: doc.picklist.map(entry => ({
                date: entry.date as string,
                reader: entry.reader as string,})),
        }));
        return books;
    }

async getbookById(id: string): Promise<book> {
        const result=await bookmodel.findOne({id})
    if (!result) {
        throw new Error(`Book with id ${id} not found`)
    }
    return {
            id:result.id as string,
            title:result.title as string,
            author:result.author as string,
            genre:result.genre as Genres,
            status:result.status as StatusBook,
            picklist: result.picklist.map(entry => ({
                date: entry.date as string,
                reader: entry.reader as string,
            }))}


}

   async givebookToreader(reader: number, id_book: string): Promise<boolean> {
       const readerID= reader as unknown as string;
        const give=await bookmodel.updateOne(
           { id: id_book },
           {$push: {picklist: {reader: readerID, date: new Date().toISOString(),}}});
        if(give){
            this.service.pickUP(id_book)
            return true}


        return false;
    }

    async removeReader(username: string): Promise<boolean> {
        const result = await reader_model.findOneAndDelete({
            email: username
        })
        if (!result) {
            throw new Error(`problem with remove Reader `)
        }
        return Promise.resolve(true);
    }

    async updateReader(reader: Reader): Promise<boolean> {
        const result = await reader_model.findOneAndUpdate({email: reader.email}, reader)
        if (!result) {
            throw new Error(`problem with updateReader `)
        }
        return Promise.resolve(true);
    }

    async updateRole(email: string, role: Role[]): Promise<Reader> {
        const body=role
        const result =await reader_model.findOneAndUpdate({email}, {$set:{roles:role}})
if (!result) { throw new Error(`problem with updateRole `) }
        return  result as unknown as Reader;
    }

    async getAccount(email: string): Promise<Reader> {
        const result = await reader_model.findOne({email})
        if (!result) throw new Error(`problem with getAccount `)

return Promise.resolve(result as unknown as Reader);
    }


    async getaccby_book(bookname: string): Promise<Reader[]> {
        const books = await bookmodel.find({ title: bookname }).lean();
        const readerIds = books.flatMap(book => book.picklist.map(record => record.reader));
        const uniqueReaderIds = [...new Set(readerIds)];
        const readers = await reader_model.find({ id: { $in: uniqueReaderIds } });

        if (!readers || readers.length === 0) {
            throw new Error(`No readers found for book "${bookname}"`);
        }
        return[readers as unknown as Reader];
    }

    async GetALlreadarsOFbook(id_book:string): Promise<{ Who_read_now: Reader[]; Who_readed: Reader[] }> {
       try{ const book= await this.getbookById(id_book);
        let arry_who_read:string[]=[];
        let arry_who_readed:string[]=[];
        console.log(book)
        book.picklist.map(entry => {
            let x=entry.reader
            if(x.includes(`returned book`)){
                arry_who_readed.push(x);
            } else {
                arry_who_read.push(x);
            }
        })
        console.log(arry_who_read)
        console.log(arry_who_readed)
        let result_1:Reader[]=await Promise.all(arry_who_read.map(id => {
            console.log(id);
            let readerId =id.replace(/\D/g, "");
             return this.GetAllaboutReader(readerId as unknown as number)
        }))

        let result_2:Reader[]=await Promise.all(arry_who_readed.map(id => {
            let readerId =id.replace(/\D/g, "");
             return this.GetAllaboutReader(readerId as unknown as number)
        }))


        console.log(result_1)
        console.log(result_2)


             let end={
            Who_read_now:result_1,
            Who_readed:result_2
            }
            console.log(end)
            return end}

 catch (e) {throw new Error(`Problem in function ${e}`,)}

    }






}

/*
{
  "lastname": "Ivanov",
  "passport": "1323456789",
  "email": "ivanovs@example.com",
  "birthdate": "1990-05-12",
  "password": "securePassword123"
}
 */