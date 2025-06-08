import {Reader_Interface} from "../../services/libserv.js";
import { Response, NextFunction, RequestHandler} from "express";
import bcrypt from "bcrypt";
import {authreq} from "../tools.js";
import {Role} from "../../model/book.js";

async function basicAuth(header: string, req: authreq, service: Reader_Interface) {
    const BASIC = 'Basic ';
    const authtoken = Buffer.from(header.substring(BASIC.length), 'base64').toString('ascii');
    const [email, password] = authtoken.split(":");

    try {
        const account = await service.getAccount(email);
        console.log(account);

        if (!bcrypt.compareSync(password, account.passHash as string)) {
            throw new Error("Invalid password");
        }
        req.email = email;
        req.roles = account.roles;

        console.log(`Reader ${req.email} authenticated`);
return true
    } catch (err) {
        console.log(`Authentication failed for email: ${email}`);
        throw new Error("Authentication failed");
    }
}

export const authet = (service: Reader_Interface): RequestHandler => {
    return async (req: authreq, res: Response, next: NextFunction) => {
        const header = req.header("Authorization");

        if (!header) {
            return next();
        }
        try {
            const result=await basicAuth(header, req, service)
           if(result) next(); // только если auth успешен
        } catch (err) {
            res.status(401).json({ error: (err as Error).message });
        }
    };
};


export const skiprouts = (skips: string[]) =>
    (req: authreq, res: Response, next: NextFunction) => {
        const pathmethod = `${req.method}${req.path}`;
        console.log('Checking skip:', pathmethod);

        if (!skips.includes(pathmethod) && !req.email) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        next();
    };


