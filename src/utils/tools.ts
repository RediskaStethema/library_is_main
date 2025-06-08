import {bookDTO} from "../model/dtobook.js";
import {book, Genres, Role, StatusBook} from "../model/book.js";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt"
import {Reader, ReaderDTO} from "../model/reader_type.js";
import {Request} from "express";

export const convetStringto_toGENRE=(genre:string) => {
    const Bookgenre=Object.values(Genres).find(v=>v===genre)
    if(!Bookgenre){
        throw new Error( JSON.stringify({status:400, message:`Genre '${genre}' not found`}), );
    }return Bookgenre
}
export function convertto9(code10: string): number {
    if (!/^\d{10}$/.test(code10)) {
        throw new Error("Код должен состоять из ровно 10 цифр");
    }

    const checksum = code10
        .split("")
        .reduce((sum, digit) => sum + Number(digit), 0);

    const indexToRemove = checksum % 10;

    const code9 = code10.slice(0, indexToRemove) + code10.slice(indexToRemove + 1);

    return Number(code9);
    //TODO переделать функцию
}


export const converbookDTO=(dto:bookDTO):book=>{
    return {
        id:uuidv4(),
        author:dto.author,
        title:dto.title,
        status:StatusBook.ON_STOCK,
        genre:convetStringto_toGENRE(dto.genre),
        picklist: [],



    }
}

export const convertBookToBookDto = (book:book):bookDTO => {
    return {
        title: book.title,
        author: book.author,
        genre: book.genre
    }
}
 export const getStatus=(status: string)=>{
     const Bookstatus=Object.values(StatusBook).find(v=>v===status);
     if(!Bookstatus) throw new Error( JSON.stringify({status:400, message:`Genre '${status}' not found`}), );

     return Bookstatus

}

export const converttoReader=(dto:ReaderDTO): Reader=>{
    const id=convertto9(dto.passport)
    if(dto.email&&dto.birthdate&&dto.password){
        const salt=bcrypt.genSaltSync(10)
        const hash=bcrypt.hashSync(dto.password, salt)
        if(dto.email.trim().toLowerCase().includes("adminoflibrary_of_mine.set")){
            return {
                lastname:dto.lastname,
                passHash:hash,
                email:dto.email,
                id:id,
                birthdate:dto.birthdate as string,
                date:new Date(),
                roles:[Role.ROOT_ADMIN],

            }
        }
        return{
            lastname:dto.lastname,
            passHash:hash,
            email:dto.email,
            id:id,
            birthdate:dto.birthdate as string,
            date:new Date(),
            roles:[Role.USER],

        }
    }
return{
    lastname:dto.lastname,
    id:id,
    date:new Date,
}
}

export interface authreq extends Request {

    email?:string
    roles?:Role[]
}

export const skipRouts:string[]=[
`POST/api/readers`,
`GET/api/books`,
`GET/api/readers/readers_of_book`
]



export const pathroles: Record<string, Role[]> = {
    // ReaderRouter
    "PATCH/api/readers/updaterole":[Role.ROOT_ADMIN],
    "POST/api/readers": [Role.ADMIN],
    "PATCH/api/readers/gavebook": [Role.LIBRARIAN],
    "GET/api/readers/allreadersbooks": [Role.USER, Role.ADMIN, Role.LIBRARIAN],
    "GET/api/readers/all_about_readers": [Role.ADMIN, Role.LIBRARIAN],
    "GET/api/readers/bymail": [Role.ROOT_ADMIN, Role.ADMIN, Role.LIBRARIAN],
    // BooksRouter
    "GET/api/books": [Role.USER, Role.ADMIN],
    "POST/api/books": [Role.ADMIN, Role.ROOT_ADMIN, Role.LIBRARIAN],
    "GET/api/books/genre": [Role.USER],
    "PUT/api/books/pick_up": [Role.USER, Role.LIBRARIAN],
    "DELETE/api/books": [Role.ADMIN,Role.ROOT_ADMIN],
    "PUT/api/books/return": [Role.ADMIN, Role.LIBRARIAN],
    "GET/api/books/genre/status": [Role.USER, Role.ADMIN],
    "GET/api/books/book_byID": [Role.USER, Role.LIBRARIAN, Role.ADMIN, Role.ROOT_ADMIN]
}



/*

{
  "lastname": "Daniel",
  "passport": "0904560789",
  "email": "adminoflibrary_of_mine.set",
  "birthdate": "1990-05-12",
  "password": "123321"
}



 */