import express from "express";
import { isAuthenticated, isAdminOrRh,isAdmin } from "../controllers/authentification.js";
import {
  createprof,
  searchprof,
  updateprof,
  getAllProfesseurs,
  deleteprof,
  importProfesseurs,
} from "../controllers/crudprof.js";

const router = express.Router();

router.post("/professeurs/import", isAuthenticated, isAdminOrRh, importProfesseurs);
router.post("/professeurs",isAuthenticated,isAdminOrRh, createprof);
router.get("/professeurs/search", isAuthenticated, isAdmin,searchprof);
router.put("/professeurs/:id",isAuthenticated, isAdmin, updateprof);
router.get("/professeurs", isAuthenticated,isAdminOrRh, getAllProfesseurs);
router.delete("/professeurs/:id",isAuthenticated, isAdmin, deleteprof);

export default router;