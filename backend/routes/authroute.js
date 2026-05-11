// routes/protectedRoutes.js
import express from "express";
import { isAuthenticated, isAdmin, isProf, isRh,authroute } from "../controllers/authentification.js";

const router = express.Router();

router.get("/admin", isAuthenticated, isAdmin, (req, res) => {
  res.json({ message: "Bienvenue Admin" });
});

// accessible uniquement aux profs
router.get("/prof", isAuthenticated, isProf, (req, res) => {
  res.json({ message: "Bienvenue Prof" });
});

// accessible uniquement aux RH
router.get("/rh", isAuthenticated, isRh, (req, res) => {
  res.json({ message: "Bienvenue RH" });
});
router.get("/auth",isAuthenticated,authroute)
export default router;
