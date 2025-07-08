import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ApiError } from "../utility/ApiError.js";


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
    IVHEX: {
        type: String,
        required: true,
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


dataSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})


dataSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


dataSchema.pre('save', async function (next){
    if(!this.isModified("encryptedText") || !this.encryptedText) return next();

    try {
        const KEY = Buffer.from( process.env.MASTER_KEY, 'hex' );
        const IV = Buffer.from(this.IVHEX, 'hex');
        const cipher = await crypto.createCipheriv(process.env.CIPHER_ALGORITHM, KEY, IV);

        const encrypt = Buffer.concat([
            cipher.update(this.encryptedText, 'utf8'),
            cipher.final()
        ])

        this.encryptedText = encrypt.toString("hex");
        next();
    } catch (error) {
        throw new ApiError(500,"Encryption failed: " + error.message);
        //return next(error);
    }
})


dataSchema.methods.decrypt = async function () {
    const KEY = this.password;
    const IV = Buffer.from(this.IVHEX, 'hex');
    const text = Buffer.from(this.encryptedText, 'hex');

    const decipher = crypto.createDecipheriv(process.env.CIPHER_ALGORITHM, KEY, IV);

    const decryptedText = Buffer.concat([
        decipher.update(text),
        decipher.final()
    ])

    return decryptedText.toString('utf8');
}


export const SecretData = mongoose.model("SecretData", dataSchema);