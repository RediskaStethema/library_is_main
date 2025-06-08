import {Reader, ReaderDTO} from "../model/reader_type.js";

import {converttoReader} from "../utils/tools.js";

import {service_} from "../config_files/port_socket.js";
import {Role} from "../model/book.js";



export class Reader_control {
    // private servic2e = new NewService_sql_imbd_impl;
    private service = service_; // Предполагается, что это экземпляр Mongo_reader_imbd_impl или другой реализации Reader_Interface

    async postnewreader(reader_Dto: ReaderDTO) {
        const reader: Reader = await converttoReader(reader_Dto);
        if (!reader) throw new Error(JSON.stringify(reader));
        return await this.service.createNewreader(reader);
    }

    async gavebook(reader_id: number, id_book: string) {
        return await this.service.givebookToreader(reader_id, id_book);
    }

    async readersbooks(reader_id: number) {
        return await this.service.getReadersbooks(reader_id);
    }

    async allabout(reader_id: number) {
        return await this.service.GetAllaboutReader(reader_id);
    }


    async removeReader(email: string): Promise<boolean> {
        return await this.service.removeReader(email);
    }

    async updateReader(reader_Dto: ReaderDTO): Promise<boolean> {
        const reader: Reader = await converttoReader(reader_Dto);
        return await this.service.updateReader(reader);
    }

    async updateRole(email: string, roles: Role[]): Promise<Reader> {
        return await this.service.updateRole(email, roles);
    }

    async getAccount(email: string): Promise<Reader> {
        return await this.service.getAccount(email);
    }
    async  Get_all_readers_of_book(id_book:string): Promise<{ Who_read_now: Reader[]; Who_readed: Reader[] }>{
        console.log(id_book)
        if (id_book == null|| !id_book) {
            throw new Error(`No readers found for book "${id_book}"`);
        }
        return await this.service.GetALlreadarsOFbook(id_book);
    }
}