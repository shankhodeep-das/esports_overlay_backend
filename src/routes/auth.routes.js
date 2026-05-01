import express from "express"
import Router from "express";
import { requestAccess, login, getMe, logout } from "../controllers/auth.controller.js";


const router = Router();


router.post("/request-access",requestAccess);
router.post("/signup",login);
router.get('/me',getMe);
router.post("/logout",logout);

export default router;