var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { converttoReader } from "../utils/tools.js";
import { service_ } from "../config_files/port_socket.js";
export class Reader_control {
    constructor() {
        this.service = service_;
    }
    postnewreader(reader_Dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = yield converttoReader(reader_Dto);
            if (!reader)
                throw new Error(JSON.stringify(reader));
            return yield this.service.createNewreader(reader);
        });
    }
    gavebook(reader_id, id_book) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.givebookToreader(reader_id, id_book);
        });
    }
    readersbooks(reader_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.getReadersbooks(reader_id);
        });
    }
    allabout(reader_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.GetAllaboutReader(reader_id);
        });
    }
    removeReader(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.removeReader(email);
        });
    }
    updateReader(reader_Dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = yield converttoReader(reader_Dto);
            return yield this.service.updateReader(reader);
        });
    }
    updateRole(email, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.updateRole(email, roles);
        });
    }
    getAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.getAccount(email);
        });
    }
    Get_all_readers_of_book(id_book) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id_book);
            if (id_book == null || !id_book) {
                throw new Error(`No readers found for book "${id_book}"`);
            }
            return yield this.service.GetALlreadarsOFbook(id_book);
        });
    }
}
