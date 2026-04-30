import app from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import startCleanupTask from "./src/services/cleanUpData.services.js";
import cors from 'cors';

connectDB();

app.use(cors({
    origin: 'https://fxaeproductions.vercel.app', // No trailing slash
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});