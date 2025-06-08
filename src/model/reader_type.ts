import {Role} from "./book.js";


export type Reader={
    lastname:string,
    passHash?: string,
    email?:string,
    id:number,
    date:Date,
    birthdate?:string,
    record_id?:number,
    books?:string,
    roles?:Role[],
}

export type ReaderDTO={
    lastname:string,
    passport:string,
    email?:string,
    birthdate?:string,
    password?:string,
}