import db from "../db.js";

export const listJournalLogs = (req, res) => {
  db.query(
    `
    SELECT 
      jl.idlog,
      jl.action,
      jl.temps,
      u.nomuser,
      u.prenuser,
      u.roleuser
    FROM journallog jl
    JOIN utilisateur u ON jl.iduser = u.iduser
    ORDER BY jl.temps DESC
    LIMIT 200
    `,
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(rows);
    }
  );
};