import {book, Genres, Role, StatusBook} from "../model/book.js";
import {Reader} from "../model/reader_type.js";




export interface  Libserv {
    addbook:(book:book)=>Promise<boolean>,
    removebook:(id:string)=>Promise<book>,
    pickUP:(id:string)=>Promise<void>,
    returnbook:(id:string, reader:string)=>Promise<void>,
    getALlbooks:()=>Promise<book[]>,
    getbyhenre:(genre:Genres)=>Promise<book[]>,
    getBookSatusGenre:(genre:Genres, status:StatusBook)=>Promise<book[]>,
    getbookbyID:(id:string)=>Promise<book>,

}


export interface Reader_Interface {
    createNewreader(reader:Reader):void
    getbookById(id:string):Promise<book>;
    getReadersbooks(id:number):Promise<book[]>;
    GetAllaboutReader(id:number):Promise<Reader>;
    givebookToreader(reader:number, id_book:string):Promise<boolean>;
    removeReader(username:string):Promise<boolean>;
    updateReader(reader:Reader):Promise<boolean>;
    updateRole(email:string, role:Role[]):Promise<Reader>;
    getAccount(email:string):Promise<Reader>;
    getaccby_book(bookname:string):Promise<Reader[]>
    GetALlreadarsOFbook(id_book:string): Promise<{ Who_read_now: Reader[]; Who_readed: Reader[] }>
}