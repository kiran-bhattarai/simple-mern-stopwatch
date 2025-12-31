import { AppError } from "../errors/AppError.js";
import User from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.util.js";
import { issueAccessToken, verifyAccessToken } from "../utils/jwt.util.js";
import { ACCESS_TOKEN_SECRET } from "../config/jwt.js";

const signup = async ({ username, password }) => {
    if (!username || !password) throw new AppError("Incomplete credentials", 400);
    const previousUser = await User.findOne({ username: username });
    if (previousUser) throw new AppError("Username already exists", 409);
    const hashedPassword = await hashPassword(password)
    const newUser = await User.create({ username, password: hashedPassword });
    const accessToken = issueAccessToken(newUser._id.toString());
    return  ({accessToken}) ;
}

const login = async ({ username, password }) => {
    if (!username || !password) throw new AppError("Incomplete credentials", 400);
    const previousUser = await User.findOne({ username: username });
    if (!previousUser) throw new AppError("Username doesnt exist", 409);
    const isMatch = await comparePassword(password, previousUser.password)
    if (!isMatch) throw new AppError("Invalid password", 401)
    const accessToken = issueAccessToken(previousUser._id.toString());
    return  ({accessToken}) ;
}

const check = async ({ token }) => {
    if (!token) throw new AppError("Not authenticated", 401);
    try{
        const payload = verifyAccessToken(token, ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ _id: payload.userId })
        return (user.username);
    }
    catch{
        throw new AppError("Invalid Token", 401)
    }
}

const authService = { login, signup, check };
export default authService;