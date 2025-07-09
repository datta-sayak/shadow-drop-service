import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { requestLogs } from "./utility/requestLogs.js";


const app = express();


app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(requestLogs);

// Import routes
import uploadRoute from "./routes/upload.route.js";
import downloadRoute from "./routes/download.route.js";
app.use("/api/v1/upload", uploadRoute);
app.use("/api/v1/download", downloadRoute);

export default app;