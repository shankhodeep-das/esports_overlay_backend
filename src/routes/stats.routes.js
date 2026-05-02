import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { getStats, latency, getServerLoad } from '../controllers/stats.controller.js';


const router = express.Router();

router.get("/members", verifyToken, getStats);
router.get("/latency", verifyToken, latency);
router.get("/server-load",verifyToken, getServerLoad)


export default router;