import { nanoid } from "nanoid";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { ApiError } from "../utility/ApiError.js";
import { SecretData } from "../models/secretData.models.js";
import crypto from "crypto";





const uploadFile = asyncHandler( async (req, res) => {

    const { expireTime, password } = req.body;      //time in min

    if ( !expireTime || !password) {
        res.status(400);
        throw new ApiError(400, "Please enter both expiration time and password");
    }
    if(!req.file) {
        res.status(400);
        throw new ApiError(400, "Please upload a file");
    }
    const shortUrl = nanoid(10);
    const IV = crypto.randomBytes(16);
    const expiresAt = new Date(Date.now() + expireTime * 60000);

    const inputDb = await SecretData.create({
        shortUrl,
        filePath: req.file.path,
        originalFileName: req.file.originalname,
        IVHEX: IV.toString('hex'),
        expiresAt,
        password,
    });
    const databaseEntry = await SecretData.findById(inputDb._id).select("-password -IVHEX -encryptedText");

    const fullUrl = req.protocol + "://" + req.get("host") + "/api/v1/download/" + databaseEntry.shortUrl;
    console.log(`file point ${fullUrl}`);
    return res
            .status(201)
            .json( new ApiResponse(201, fullUrl, "File uploaded successfully"));
})


const uploadText = asyncHandler( async (req, res) => {

    const { expireTime, password, text } = req.body // time in min

    if ( !expireTime || !password || !text) {
        res.status(400);
        throw new ApiError(400, "Please enter expiration time, password and text");
    }
    const shortUrl = nanoid(10);
    const IV = crypto.randomBytes(16);
    const expiresAt = new Date(Date.now() + expireTime * 60000);

    const inputDb = await SecretData.create({
        shortUrl,
        IVHEX: IV.toString('hex'),
        expiresAt,
        password,
        encryptedText: text
    });
    const databaseEntry = await SecretData.findById(inputDb._id).select("-password -IVHEX -encryptedText");

    const fullUrl = req.protocol + "://" + req.get("host") + "/api/v1/download/" + databaseEntry.shortUrl;
    console.log(`text point ${fullUrl}`);
    return res
        .status(201)
        .json( new ApiResponse(201, fullUrl, "Text uploaded successfully"));
})


export { uploadFile, uploadText };