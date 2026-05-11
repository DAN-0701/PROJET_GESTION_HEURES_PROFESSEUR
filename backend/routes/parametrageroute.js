import express from "express";
import { isAuthenticated, isAdmin } from "../controllers/authentification.js";
import { getParametrages, updateParametrage } from "../controllers/parametrage.js";

const router = express.Router();

router.get("/parametrage", isAuthenticated, getParametrages);
router.put("/parametrage", isAuthenticated, isAdmin, updateParametrage);

export default router;
