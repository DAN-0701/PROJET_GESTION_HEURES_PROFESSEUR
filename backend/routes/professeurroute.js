import express from "express";
import { isAuthenticated, isProf } from "../controllers/authentification.js";
import {
  mesHeures,
  mesStatistiques,
  monRecap,
  mesStatsParMatiereNiveau,
  mesStatsParAnnee,   // ✅ AJOUT
  mesHeuresDetails
} from "../controllers/professeur.js";

const router = express.Router();

router.get("/prof/heures", isAuthenticated, isProf, mesHeures);
router.get("/prof/statistiques", isAuthenticated, isProf, mesStatistiques);
router.get(
  "/prof/statistiques/annee",
  isAuthenticated,
  isProf,
  mesStatsParAnnee
);
/* ✅ NOUVELLE ROUTE POUR LE GRAPHIQUE À BANDES */
router.get(
  "/prof/statistiques/details",
  isAuthenticated,
  isProf,
  mesStatsParMatiereNiveau
);

router.get("/prof/recap", isAuthenticated, isProf, monRecap);
router.get("/prof/statistiques/rapport-details", isAuthenticated, isProf, mesHeuresDetails);

export default router;