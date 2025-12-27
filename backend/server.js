import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./User.js"
import Timestamp from "./Timestamp.js";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit"
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";


configDotenv();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URL)

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: {
        error: "Too many attemps. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
})

const issueAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET);
}

app.post("/signup", authLimiter, async (req, res) => {

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Incomplete credientials" })
        }

        const previousUser = await User.findOne({ username: username })

        if (previousUser) {
            return res.status(409).json({ error: "Username already exists" })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = await User.create({ username, password: passwordHash })
        const accessToken = issueAccessToken(newUser._id.toString())

        res.cookie(process.env.COOKIE_NAME, accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: process.env.COOKIE_MAX_AGE,
        });


        return res.status(201).json({ message: "User registered successfully" })
    }
    catch (err) {
        res.status(500).json({ error: "Server error", errorCode: err })
    }
})



app.post("/login", authLimiter, async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Incomplete credientials" })
        }

        const previousUser = await User.findOne({ username: username })

        if (!previousUser) {
            return res.status(409).json({ error: "Username doesnt exist" })
        }

        const isMatch = await bcrypt.compare(password, previousUser.password)

        if (!isMatch) return res.status(409).json({ message: "Invalid password" })

        const accessToken = issueAccessToken(previousUser._id.toString())

        res.cookie(process.env.COOKIE_NAME, accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: process.env.COOKIE_MAX_AGE,
        });


        res.status(200).json({ message: 'Login successful' })

    }
    catch{
        res.status(500).json({ error: "Server error" })
    }
})

app.get("/check", async (req, res) => {

    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.status(401).json({ message: "Not authenticated" })

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findOne({ _id: payload.userId })

        res.status(200).json({ username: user.username })

    } catch{
        res.status(401).json({ message: "Invalid token" })
    }
})


app.post("/timestamps", async (req, res) => {

    const { time } = req.body;
    
    if (time === "00:00:00"){
        return res.status(204).end()
    }
    
    const token = req.cookies[process.env.COOKIE_NAME];

    if (!token) return res.status(401).json({ message: "not authenticated" })

    try {

        const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)



        const timestamp = await Timestamp.create({
            user: userId,
            time,
        })

        res.status(201).json(timestamp)
    }
    catch (err) {
        console.log(err)
        res.status(401).json({ message: "Invalid token" })
    }
})

app.get("/timestamps", async (req, res) => {
    const token = req.cookies[process.env.COOKIE_NAME];

    if (!token) return res.status(401).json({ message: "not authenticated" })

    try {
        const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const timestamps = await Timestamp.find({ user: userId }).sort({ createdAt: -1 }).select("time")

        res.status(201).json(timestamps)
    }
    catch {
        res.status(401).json({ message: "Invalid token" })
    }

})

app.delete("/timestamps/:id", async (req, res) => {
    const token = req.cookies[process.env.COOKIE_NAME];

    if (!token) return res.status(401).json({ message: "not authenticated" })

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const { id } = req.params;

        await Timestamp.findOneAndDelete({
            _id: id,
            user: payload.userId
        })
        res.status(200).json({ message: "Timestamp deleted" })
    }
    catch(err) {
        console.log(err)
        res.status(401).json({ message: "Invalid token" })
    }


})





app.post("/logout", (req, res) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        sateSite: "secure",
        secure: false,
    })

    res.status(200).json({ message: "Logged out successfully" })



})




app.listen(process.env.PORT, () => {
    console.log(`Sever is running on port ${process.env.PORT}`)
})