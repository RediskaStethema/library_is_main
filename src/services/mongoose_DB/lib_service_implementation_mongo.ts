import {Libserv} from "../libserv.js";
import {book, Genres, StatusBook} from "../../model/book.js";
import {bookmodel} from "../../model/schema_mongo.js";




export class MongoClient implements Libserv{


    async addbook(book: book): Promise<boolean> {
        const isExist = await bookmodel.findOne({id: book.id})
       if(isExist)return Promise.resolve(false);
        const book_doc=new bookmodel(book)
        await book_doc.save()
        return Promise.resolve(true);
    }

    async getALlbooks(): Promise<book[]> {
        return  Promise.resolve( await bookmodel.find({}));
    }

    async getbyhenre(genre: Genres): Promise<book[]> {
        return Promise.resolve(await bookmodel.find({genre}));
    }

   async pickUP(id: string): Promise<void> {
        const book= await bookmodel.findOne({id})
       if(!book) throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
       if(book.status !== StatusBook.ON_STOCK) throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
    book.status=StatusBook.ON_HAND
       book.save()

    }

    async removebook(id: string): Promise<book> {
        const book = await bookmodel.findOneAndDelete({id})
        if (!book) throw new Error(JSON.stringify({status: 404, message: `Book with id ${id} not found`}))
        return book as book
    }

    async returnbook(id: string, reader: string): Promise<void> {
        const book = await bookmodel.findOne({id})
        if (!book) throw new Error(JSON.stringify({status: 404, message: `Book with id ${id} not found`}))
        book.status = StatusBook.ON_STOCK;
        book.picklist.push({reader:`Reader:${reader} returned book`, date: new Date().toDateString()})
        book.save();

    }

   async getBookSatusGenre(genre: Genres, status: StatusBook): Promise<book[]> {
    const result=await bookmodel.find({genre, status})
        return Promise.resolve(result as book[]);
    }
    async getbookbyID(id: string): Promise<book> {
        console.log(id)
        const result = await bookmodel.findOne({id:id});
        if (!result) {
            console.log(result)
            throw new Error('Book not found');
        }
        return result.toObject() as book;
    }


}