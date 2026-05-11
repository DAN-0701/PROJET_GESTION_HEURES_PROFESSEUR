import express from "express";
import { createadmin,searchadmin,updateadmin,listadmin,deleteadmin } from "../controllers/crudadmin.js"
import { isAuthenticated, isAdmin } from "../controllers/authentification.js";

const router=express.Router()

router.post("/admins", isAuthenticated, isAdmin, createadmin)
router.get("/admins/search", isAuthenticated, isAdmin, searchadmin)
router.get("/admins",isAuthenticated, isAdmin, listadmin)
router.put("/admins/:id", isAuthenticated, isAdmin, updateadmin);
router.delete("/admins/:id", isAuthenticated, isAdmin, deleteadmin);           
export default router