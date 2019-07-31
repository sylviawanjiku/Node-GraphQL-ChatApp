import mongoose from "mongoose";

export const User = mongoose.model("User", {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: { unique: true }
    }
});

export const Message = mongoose.model("Message", {
    message: String,
    senderMail: String,
    receiverEmail: String,
    timeStamp: Number
});

