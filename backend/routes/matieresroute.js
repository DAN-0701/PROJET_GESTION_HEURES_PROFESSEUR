import express from "express";
import {
  isAuthenticated,
  isAdminOrRh,
  isAdmin
} from "../controllers/authentification.js";

import {
  listMatieres,
  createMatiere,
  updateMatiere,
  deleteMatiere,
  searchMatiere     
} from "../controllers/matieres.js";

const router = express.Router();

router.get("/matieres", isAuthenticated, isAdminOrRh, listMatieres);
router.get("/matieres/search", isAuthenticated, isAdminOrRh, searchMatiere);
router.post("/matieres", isAuthenticated, isAdmin, createMatiere);
router.put("/matieres/:id", isAuthenticated, isAdmin, updateMatiere);
router.delete("/matieres/:id", isAuthenticated, isAdmin, deleteMatiere);

export default router;