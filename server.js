import app from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import startCleanupTask from "./src/services/cleanUpData.services.js";
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

connectDB();


const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});