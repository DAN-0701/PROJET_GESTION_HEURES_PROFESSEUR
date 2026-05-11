import express from "express";
import {
  isAuthenticated,
  isAdminOrRh,
  isAdmin
} from "../controllers/authentification.js";

import {
  listTauxHoraires,
  searchTauxHoraires,
  createTauxHoraire,
  updateTauxHoraire,
  deleteTauxHoraire
} from "../controllers/thoraire.js";

const router = express.Router();

/* LISTE */
router.get("/thoraire", isAuthenticated, isAdminOrRh, listTauxHoraires);

/* SEARCH */
router.get("/thoraire/search", isAuthenticated, isAdminOrRh, searchTauxHoraires);

/* CREATION */
router.post("/thoraire", isAuthenticated, isAdmin, createTauxHoraire);

/* MODIFICATION */
router.put("/thoraire/:id", isAuthenticated, isAdmin, updateTauxHoraire);

/* SUPPRESSION */
router.delete("/thoraire/:id", isAuthenticated, isAdmin, deleteTauxHoraire);

export default router;