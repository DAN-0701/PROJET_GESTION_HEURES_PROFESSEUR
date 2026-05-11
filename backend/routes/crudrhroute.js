import express from "express";
import { create, search, update,listrh, deleterh } from "../controllers/crudrh.js";
import { isAuthenticated, isAdmin } from "../controllers/authentification.js";

const router=express.Router()

router.post("/rh", isAuthenticated, isAdmin, create);
router.get("/rh/search", isAuthenticated, isAdmin, search);
router.get("/rhlist",isAuthenticated,isAdmin,listrh)
router.put("/rh/:id", isAuthenticated, isAdmin, update);
router.delete("/rh/:id", isAuthenticated, isAdmin, deleterh);           
export default router