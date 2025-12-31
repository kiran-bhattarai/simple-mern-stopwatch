import timestampService from "../services/timestamp.service.js";
import { COOKIE_NAME } from "../config/cookie.js";

const timestampPost = async (req, res, next) => {
    try {
        const { time } = req.body;
        if (time === "00:00:00") return res.status(204).end();
        const token = req.cookies[COOKIE_NAME];
        if (!token) return res.status(401).json({ message: "not authenticated" });
        const timestamp = await timestampService.timestampPost({ token, time });
        res.status(201).json(timestamp)

    } catch (err) {
        next(err);
    }
}

const timestampGet = async (req, res, next) => {
    try {
        const token = req.cookies[COOKIE_NAME];
        if (!token) return res.status(401).json({ message: "not authenticated" });
        const timestamps = await timestampService.timestampGet({ token });
        res.status(201).json(timestamps)
    } catch (err) {
        next(err);
    }
}

const timestampDelete = async (req, res, next) => {
    try {
        const token = req.cookies[COOKIE_NAME];
        if (!token) return res.status(401).json({ message: "not authenticated" });
        const {id} = req.params;
        await timestampService.timestampDelete({ token, id });
       res.status(200).json({ message: "Timestamp deleted" })
    } catch (err) {
        next(err);
    }
}

const timestampController = {timestampPost, timestampGet, timestampDelete}
export default timestampController;