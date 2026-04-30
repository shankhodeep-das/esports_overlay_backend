import express from "express"
import Router from "express";
import { requestAccess, login, getMe } from "../controllers/auth.controller.js";


const router = Router();


router.post("/request-access",requestAccess);
router.post("/signup",login);
router.get('/me',getMe);

export default router;