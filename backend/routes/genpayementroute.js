import express from "express";
import { isAuthenticated, isRh } from "../controllers/authentification.js";
import { genererEtatPayement } from "../controllers/genpayement.js";

const router = express.Router();

router.get("/payement", isAuthenticated, isRh, genererEtatPayement);

export default router;