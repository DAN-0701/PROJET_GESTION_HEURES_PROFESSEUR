import express from "express";
import { isAuthenticated, isAdmin } from "../controllers/authentification.js";
import { listJournalLogs } from "../controllers/journallog.js";

const router = express.Router();

router.get("/journallog", isAuthenticated, isAdmin, listJournalLogs);

export default router;