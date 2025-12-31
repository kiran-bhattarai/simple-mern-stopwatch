import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import timestampRoute from "./routes/timestamp.route.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.middleware.js";
import { CLIENT_URL } from "./config/client.js";

const app = express();

app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoute)
app.use("/time", timestampRoute)

app.use(globalErrorHandler)

export default app;