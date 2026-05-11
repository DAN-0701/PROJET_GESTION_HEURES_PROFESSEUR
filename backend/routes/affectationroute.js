import express from "express";
import { isAuthenticated, isAdminOrRh } from "../controllers/authentification.js";
import {
  listAffectations,
  createAffectation,
  updateAffectation,
  deleteAffectation
} from "../controllers/affectation.js";

const router = express.Router();

router.get("/affectations", isAuthenticated, isAdminOrRh, listAffectations);
router.post("/affectations", isAuthenticated, isAdminOrRh, createAffectation);
router.put("/affectations/:id", isAuthenticated, isAdminOrRh, updateAffectation);
router.delete("/affectations/:id", isAuthenticated, isAdminOrRh, deleteAffectation);

export default router;