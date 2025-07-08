import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";


const app = express();


app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.static("public"));

// Import routes
import uploadRoute from "./routes/upload.route.js";
app.use("/api/v1/", uploadRoute);

export default app;