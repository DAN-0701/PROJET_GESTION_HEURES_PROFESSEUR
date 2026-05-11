import express from "express";
import { isAuthenticated } from "../controllers/authentification.js";
import { changePassword } from "../controllers/changepass.js";
const router=express.Router()

router.put("/updatepassword", isAuthenticated, changePassword)
export default router