import {Libserv} from "./libserv.js";
import {book, Genres, StatusBook} from "../model/book.js";
import {Error} from "mongoose";

export class library_ServiceimplemEmbd implements Libserv{
   private books:book[]=[]
    async addbook(book: book):Promise<boolean> {
        const index = this.books.findIndex(item => item.id === book.id)
        if(index === -1){
            this.books.push(book);
            console.log(`book ${book.title} is added`)
            return  new Promise((res)=>{res(true)});
        }
        return  new Promise((res)=>{res(false)});
    }

    async getALlbooks(): Promise<book[]> {
       if(this.books.length===0){
            console.log(' array of books is empty')
       }

       return Promise.resolve( [...this.books]);
    }

    async getbyhenre(genre: Genres): Promise<book[]> {
        if(this.books.length===0){
            console.log(' array of books is empty')
            return this.books;
        }
        return Promise.resolve( this.books.filter(book => book.genre === genre))

    }

   async pickUP(id: string): Promise<void> {
        const index= this.books.findIndex(book => book.id === id)
        if(index === -1)
            throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        const pick_up=this.books[index]
       pick_up.status=StatusBook.ON_HAND
       console.log(`${pick_up.title} on hand`);
    }

    async removebook(id: string): Promise<book> {
      const index= this.books.findIndex(book => book.id === id)
        if(index === -1)
            throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        const removed=this.books[index]
        removed.status=StatusBook.REMOVED
        console.log(`${removed.title} removed`);
        return Promise.resolve(removed)
    }

    async returnbook(id: string, reader: string):Promise<void> {
        const index= this.books.findIndex(book => book.id === id)
        if(index === -1)
            throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        const book=this.books[index]
        if(book.status !== StatusBook.ON_HAND) throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))

        book.status=StatusBook.ON_STOCK
        book.picklist.push({reader, date:new Date().toDateString()})
        console.log(`${book.title} on stock`);

    }

    getBookSatusGenre(genre: Genres, status: StatusBook): Promise<book[]> {
        return Promise.resolve([]);
    }

    getbookbyID(id: string): Promise<book> {
        throw new Error (`Book with id ${id} not found`);
    }

}