import mongoose from "mongoose";


const dataSchema = new mongoose.Schema({
    shortUrl: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    encryptedText: {
        type: String,
        default: null
    },
    filePath: {
        type: String,
        default: null
    },
    originalFileName: {
        type: String,
        default: null
    },
    expiresAt: {
        type: Date,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

dataSchema.index({expiresAt: 1}, { expireAfterSeconds: 0 });


export const SecretData = mongoose.model("SecretData", dataSchema);