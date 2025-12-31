import { ACCESS_TOKEN_SECRET } from "../../config/jwt.js";

export const authenticate = (req, res, next) => {
    const token = req.cookies.COOKIE_NAME;
    if (!token) return res.status(401).json({ message: "Not authenticated" })
    try {
        jwt.verify(token, ACCESS_TOKEN_SECRET);
        next();
    } catch(err){
        next(err);
    }
}