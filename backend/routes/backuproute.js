import express from "express";
import { isAuthenticated, isAdmin } from "../controllers/authentification.js";
import { backupDatabase } from "../controllers/backup.js";

const router = express.Router();

router.get("/admin/backup", isAuthenticated, isAdmin, backupDatabase);

export default router;
