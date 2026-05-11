import express from "express";
import { isAuthenticated, isAdmin } from "../controllers/authentification.js";
import {
  listAnnees,
  createAnnee,
  deleteAnnee
} from "../controllers/annee.js";

const router = express.Router();

/* ✅ Lecture : ADMIN + RH */
router.get("/annees", isAuthenticated, listAnnees);

/* ✅ Écriture : ADMIN uniquement */
router.post("/annees", isAuthenticated, isAdmin, createAnnee);
router.delete("/annees/:id", isAuthenticated, isAdmin, deleteAnnee);

export default router;