import Timestamp from "../models/timestamp.model.js";
import { verifyAccessToken } from "../utils/jwt.util.js";
import { ACCESS_TOKEN_SECRET } from "../config/jwt.js";

const timestampPost = async ({ token, time }) => {
    const { userId } = verifyAccessToken(token, ACCESS_TOKEN_SECRET);
    const timestamp = await Timestamp.create({
        user: userId,
        time,
    })
    return (timestamp)
}

const timestampGet = async ({ token }) => {
    const { userId } = verifyAccessToken(token, ACCESS_TOKEN_SECRET);
    const timestamps = await Timestamp.find({ user: userId }).sort({ createdAt: -1 }).select("time")
    return (timestamps)
}

const timestampDelete = async ({ token, id }) => {
    const payload = verifyAccessToken(token, ACCESS_TOKEN_SECRET);
    await Timestamp.findOneAndDelete({
        _id: id,
        user: payload.userId
    })
}

const timestampService = { timestampPost, timestampGet, timestampDelete }
export default timestampService;