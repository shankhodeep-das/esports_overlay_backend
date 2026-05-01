import express from "express"
import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const corsOptions = {
  origin: 'https://fxaeproductions.vercel.app',
  //origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
// Handle preflight requests for ALL routes
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/auth",authRoutes);
app.use("/admin",adminRoutes);


export default app;