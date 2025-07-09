import { nanoid } from "nanoid";
import crypto from "crypto";
import fs from "fs";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { ApiError } from "../utility/ApiError.js";
import { SecretData } from "../models/secretData.models.js";






const uploadFile = asyncHandler( async (req, res) => {

    const { expireTime, password } = req.body;      //time in min

    if ( !expireTime || !password) {
        return res.status(400).json( new ApiError(400, "Please enter both expiration time and password"));
    }
    if(!req.file) {
        return res.status(400).json( new ApiResponse(400, null, "Please upload a file"));
    }
    const shortUrl = nanoid(10);
    const IV = crypto.randomBytes(16);
    const expiresAt = new Date(Date.now() + expireTime * 60000);

    const fullUrl = req.protocol + "://" + req.get("host") + "/api/v1/download/" + shortUrl;

    const inputDb = await SecretData.create({
        shortUrl: fullUrl,
        filePath: req.file.path,
        originalFileName: req.file.originalname,
        IVHEX: IV.toString('hex'),
        expiresAt,
        password,
    });

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

    const fullUrl = req.protocol + "://" + req.get("host") + "/api/v1/download/" + shortUrl;

    const inputDb = await SecretData.create({
        shortUrl: fullUrl,
        IVHEX: IV.toString('hex'),
        expiresAt,
        password,
        encryptedText: text
    });
    const databaseEntry = await SecretData.findById(inputDb._id).select("-password -IVHEX -encryptedText");

    return res
        .status(201)
        .json( new ApiResponse(201, fullUrl, "Text uploaded successfully"));
})





const download = asyncHandler( async (req, res) => {

    if( !req.body ) {
        return res.status(401).json( new ApiResponse(401, null, "Please provide password"));
    }
    const { shortUrl } = req.params;
    const { password } = req.body;

    const fullUrl = req.protocol + "://" + req.get("host") + "/api/v1/download/" + shortUrl;
    const databaseEntry = await SecretData.findOne({ shortUrl: fullUrl });

    if( !databaseEntry ) {
        return res.status(400).json( new ApiResponse(400, null, "Link does not exist"));
    }
    if( !(await databaseEntry.isPasswordCorrect( password )) ){
        return res.status(401).json( new ApiResponse(401, null, "Incorrect password"));
    }
    if( databaseEntry.used || ( databaseEntry.expiresAt && new Date() > databaseEntry.expiresAt) ) {
        return res.status(404).json( new ApiResponse(404, null, "Link already opened"));
    }

    if( databaseEntry.filePath && !databaseEntry.used ) {
        return res
            .status(200)
            .download( databaseEntry.filePath, databaseEntry.originalFileName, async (error) => {
            if (!error) {
                await fs.unlinkSync(databaseEntry.filePath);
                databaseEntry.used = true;
                await databaseEntry.save();
            }
        })
    }
    else if ( databaseEntry.encryptedText && !databaseEntry.used ) {
        return res
            .status(200)
            .json( new ApiResponse(200, await databaseEntry.decrypt(), "Text fetched successfully" ) )
    }

})
export { uploadFile, uploadText, download };