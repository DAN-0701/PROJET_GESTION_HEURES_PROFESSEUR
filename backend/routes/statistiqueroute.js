import express from "express";
import { isAuthenticated, isRh } from "../controllers/authentification.js";
import {
  heuresParProfesseur,
  heuresParType,
  heuresParAnnee,
  heuresParDepartement,
  professeursDetails,
  heuresParFiliere,
  heuresParMois
} from "../controllers/statistiquerh.js";

const router = express.Router();

router.get("/stats/professeurs", isAuthenticated, isRh, heuresParProfesseur);
router.get("/stats/types", isAuthenticated, isRh, heuresParType);
router.get("/stats/annees", isAuthenticated, isRh, heuresParAnnee);
router.get("/stats/departements", isAuthenticated, isRh, heuresParDepartement);
router.get("/stats/professeurs-details", isAuthenticated, isRh, professeursDetails);
router.get("/stats/filieres", isAuthenticated, isRh, heuresParFiliere);
router.get("/stats/mensuelles", isAuthenticated, isRh, heuresParMois);

export default router;