import authService from "../services/auth.service.js"
import { COOKIE_NAME, COOKIE_MAX_AGE } from "../config/cookie.js";

const signup = async (req, res, next) => {
    try {
        const result = await authService.signup(req.body);
        res.cookie(COOKIE_NAME, result.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: COOKIE_MAX_AGE,
        });
        res.status(201).json({ message: "User registered successfully" })
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.cookie(COOKIE_NAME, result.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: COOKIE_MAX_AGE,
        });
        res.status(200).json({ message: 'Login successful' })
    } catch (err) {
        next(err);
    }
};

const check = async (req, res, next) => {
    try {
        const token = req.cookies[COOKIE_NAME];
        if (!token) return res.status(401).json({message: "Not authenticated"})
        const username = await authService.check({token});
        res.status(200).json({ username: username });
    } catch (err) {
        next(err);
    }
}

const logout = (req, res, next) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        sateSite: "secure",
        secure: false,
    })
    res.status(200).json({ message: "Logged out successfully" })
}

const authController = { signup, login, check, logout };
export default authController;