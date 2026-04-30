import express from "express"
import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import cors from "cors"

const app = express();


const corsOptions = {
  // Replace this with your EXACT frontend URL (no trailing slash)
  origin: 'https://fxaeproductions.vercel.app', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));

app.use(express.json());


app.use("/auth",authRoutes);
app.use("/admin",adminRoutes);
app.use("/admin",adminRoutes);


export default app;