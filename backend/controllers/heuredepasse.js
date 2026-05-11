import db from "../db.js";

/* =========================
   HEURES EN DEPASSEMENT (RH)
========================= */
export const heuresDepassement = (req, res) => {
  db.query(
    `
    SELECT 
      p.matprof,
      p.nomprof,
      p.prenprof,
      m.idmat,
      m.libmat,
      m.volmat AS volume_prevu,
      SUM(hr.nbheure) AS heures_realisees,
      (SUM(hr.nbheure) - m.volmat) AS depassement
    FROM heure_realise hr
    JOIN affectation a ON hr.idaff = a.idaff
    JOIN professeur p ON a.matproff = p.matprof
    JOIN matiere m ON a.idmat = m.idmat
    WHERE hr.statut = 'valide'
    GROUP BY p.matprof, m.idmat
    HAVING heures_realisees > volume_prevu
    `,
    (err, rows) => {
      if (err) {
        console.error("❌ ERREUR SQL DEPASSEMENT :", err);
        return res.status(500).json({
          message: "Erreur SQL",
          sqlMessage: err.sqlMessage
        });
      }
      res.json(rows);
    }
  );
};
``