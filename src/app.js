import express from "express"
import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import cors from 'cors';
const app = express();
const corsOptions = {
  origin: 'https://fxaeproductions.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
// Handle preflight requests for ALL routes
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());


app.use("/auth",authRoutes);
app.use("/admin",adminRoutes);


export default app;