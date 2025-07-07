import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./database/connectionDB.js";
import app from './app.js';

connectDB()
    .then( () => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}!`);
        })
    })
    .catch( (err) => {
        console.error("Database connection failed at index.js:", err);
    });