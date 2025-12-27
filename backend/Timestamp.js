import mongoose from "mongoose";

const timeStampSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    time: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model("Timestamp", timeStampSchema)

