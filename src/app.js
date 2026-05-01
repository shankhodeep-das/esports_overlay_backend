import express from "express"
import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import cors from 'cors';


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());


app.use("/auth",authRoutes);
app.use("/admin",adminRoutes);
app.use("/admin",adminRoutes);


export default app;