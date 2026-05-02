import express, { Router } from 'express';
import { announcement, announcementRecieved } from '../controllers/announcments.controller.js';



const router = express.Router();

router.post("/announcement", announcement);
router.get("/announcementRecieved", announcementRecieved);


export default router;