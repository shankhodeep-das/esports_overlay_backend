import express from "express"
import Router from "express";
import { requestAccess, login, getMe, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";


const router = Router();


router.post("/request-access",requestAccess);
router.post("/signup",login);
router.get('/me',verifyToken,getMe);
router.post("/logout",logout);

export default router;