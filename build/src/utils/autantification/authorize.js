import { skipRouts } from "../tools.js";
export const authorize = (arr) => (req, res, next) => {
    const pathMethod = `${req.method}${req.path}`;
    const userRoles = req.roles;
    console.log(userRoles);
    const allowedRoles = arr[pathMethod];
    console.log(allowedRoles);
    if (skipRouts.includes(pathMethod) || userRoles && (allowedRoles === null || allowedRoles === void 0 ? void 0 : allowedRoles.some(role => userRoles.includes(role)))) {
        console.log(`user authorize`);
        return next();
    }
    res.status(403).json({ error: "Forbidden" });
};
