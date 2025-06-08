import {Role} from "../../model/book.js";
import {authreq, skipRouts} from "../tools.js";
import {NextFunction, Response} from "express";


export const authorize = (arr: Record<string, Role[]>) =>
    (req: authreq, res: Response, next: NextFunction) => {
        const pathMethod = `${req.method}${req.path}`;
        const userRoles = req.roles;
        console.log( userRoles);
        const allowedRoles = arr[pathMethod];
        console.log(allowedRoles)
        if (skipRouts.includes(pathMethod)|| userRoles && allowedRoles?.some(role => userRoles.includes(role))) {
            console.log(`user authorize`)
            return next();
        }
        res.status(403).json({ error: "Forbidden" });
    };
