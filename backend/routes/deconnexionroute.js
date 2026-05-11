import {logout} from "../controllers/deconnexion.js";
import express from "express";
import { isAuthenticated } from "../controllers/authentification.js";

const router=express.Router()
router.post("/logout",logout)
export default router