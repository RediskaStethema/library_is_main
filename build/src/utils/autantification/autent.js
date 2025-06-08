var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
function basicAuth(header, req, service) {
    return __awaiter(this, void 0, void 0, function* () {
        const BASIC = 'Basic ';
        const authtoken = Buffer.from(header.substring(BASIC.length), 'base64').toString('ascii');
        const [email, password] = authtoken.split(":");
        try {
            const account = yield service.getAccount(email);
            console.log(account);
            if (!bcrypt.compareSync(password, account.passHash)) {
                throw new Error("Invalid password");
            }
            req.email = email;
            req.roles = account.roles;
            console.log(`Reader ${req.email} authenticated`);
            return true;
        }
        catch (err) {
            console.log(`Authentication failed for email: ${email}`);
            throw new Error("Authentication failed");
        }
    });
}
export const authet = (service) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const header = req.header("Authorization");
        if (!header) {
            return next();
        }
        try {
            const result = yield basicAuth(header, req, service);
            if (result)
                next();
        }
        catch (err) {
            res.status(401).json({ error: err.message });
        }
    });
};
export const skiprouts = (skips) => (req, res, next) => {
    const pathmethod = `${req.method}${req.path}`;
    console.log('Checking skip:', pathmethod);
    if (!skips.includes(pathmethod) && !req.email) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
