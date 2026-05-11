import express from "express";
import { isAuthenticated, isRh } from "../controllers/authentification.js";
import { heuresDepassement } from "../controllers/heuredepasse.js";

const router = express.Router();

router.get("/heures/depassement", isAuthenticated, isRh, heuresDepassement);

export default router;