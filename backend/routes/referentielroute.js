import express from "express";
import { isAuthenticated, isAdminOrRh } from "../controllers/authentification.js";

import {
  listFilieres,
  createFiliere,
  listNiveaux,
  createNiveau,
  listProfesseurs,
  listDepartements,
  createDepartement
} from "../controllers/referentiel.js";

const router = express.Router();
//professeurs
router.get("/professeurs", isAuthenticated, isAdminOrRh, listProfesseurs);
/* FILIERES */
router.get("/filieres", isAuthenticated, isAdminOrRh, listFilieres);
router.post("/filieres", isAuthenticated, isAdminOrRh, createFiliere);

/* NIVEAUX */
router.get("/niveaux", isAuthenticated, isAdminOrRh, listNiveaux);
router.post("/niveaux", isAuthenticated, isAdminOrRh, createNiveau);

/* DEPARTEMENTS */
router.get("/departements", isAuthenticated, isAdminOrRh, listDepartements);
router.post("/departements", isAuthenticated, isAdminOrRh, createDepartement);

export default router;
