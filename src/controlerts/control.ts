import {library_ServiceimplemEmbd} from "../services/library_service_Implembd.js";
import {Libserv} from "../services/libserv.js";
import {bookDTO} from "../model/dtobook.js";
import {book} from "../model/book.js";
import {converbookDTO, convertBookToBookDto, convetStringto_toGENRE, getStatus} from "../utils/tools.js";
import {MongoClient} from "../services/mongoose_DB/lib_service_implementation_mongo.js";
import {NewService_sql_imbd_impl} from "../services/sqlservice/new_service_sql.js";
import {service_mongo_lib} from "../config_files/port_socket.js";

export class BookControler {
   // private bookserv: Libserv =new library_ServiceimplemEmbd()
 private bookserv: Libserv =service_mongo_lib
//private bookserv= new NewService_sql_imbd_impl()

   async getallbooks(){
        return await this.bookserv.getALlbooks()
    }


   async addBook(dto:bookDTO){
        const book:book=converbookDTO(dto)
       console.log(book)
       const result=await this.bookserv.addbook(book)
        if(result){
            console.log(book)
            return book

        }
        throw new Error(JSON.stringify({number:403,message:`Book Name=${book.title} ID=${book.id} not added`}));

    }
  async removeBook(id:string){
        const book= await this.bookserv.removebook(id)
        if(!book) throw Error(`Book with id ${id} not found and not  removed`);
        return  convertBookToBookDto(book)
    }
async getbyGenre(genre:string) :Promise<book[]>{
    const Genre= convetStringto_toGENRE(genre)
    if(!Genre) throw Error(`Book with ${genre} not found`);
    return await this.bookserv.getbyhenre(Genre)

}
async pickUp(id:string):Promise<void>{
       await this.bookserv.pickUP(id)
}

async returnbook(id:string, reader:string):Promise<void>{
        await this.bookserv.returnbook(id,reader)

}
async getBooksBySTatusAndGenre(genre:string,status:string):Promise<book[]>{
    const Genre= convetStringto_toGENRE(genre)
    const Status=getStatus(status)
    return  await this.bookserv.getBookSatusGenre(Genre,Status)
}
async getbookbyID(id:string):Promise<book>{
     return await this.bookserv.getbookbyID(id)

}




}