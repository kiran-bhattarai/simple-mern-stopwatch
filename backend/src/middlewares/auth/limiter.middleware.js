import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: {
        message: "Too many attemps. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
})

export default authLimiter;