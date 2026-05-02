import express, { Router } from 'express';
import { announcement, announcementRecieved } from '../controllers/announcments.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';



const router = express.Router();

router.post("/announcement", verifyToken, announcement);
router.get("/announcementRecieved", verifyToken, announcementRecieved);


export default router;