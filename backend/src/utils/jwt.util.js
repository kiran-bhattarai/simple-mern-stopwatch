import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/jwt.js";

export const issueAccessToken = (userId) => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET);
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET)
}