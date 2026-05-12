import express from "express";
import { isAuthenticated, isRh, isProf} from "../controllers/authentification.js";
import {
  saisirHeure,
  listHeures,
  validerHeure,
  updateHeure,
  deleteHeure,
  dashbord,
  reinitialiserHeure
} from "../controllers/heurerealise.js";
import { listHeuresProf } from "../controllers/heurerealise.js";


const router = express.Router();

/* RH */
router.get(
  "/heures/prof",
  isAuthenticated,
  isProf,
  listHeuresProf
);
router.get("/dashbord", isAuthenticated, isRh, dashbord);
router.post("/heures", isAuthenticated, isRh, saisirHeure);
router.get("/heures", isAuthenticated, isRh, listHeures);
router.put("/heures/:id/valider", isAuthenticated, isRh, validerHeure);
router.put("/heures/:id", isAuthenticated, isRh, updateHeure);
router.put("/heures/:id/reinitialiser", isAuthenticated, isRh, reinitialiserHeure);
router.delete("/heures/:id", isAuthenticated, isRh, deleteHeure);
export default router;