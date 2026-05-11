import db from "../db.js";

/* =========================
   ETAT DE PAIEMENT MENSUEL (RH)
========================= */
export const genererEtatPayement = (req, res) => {
  const month = Number(req.query.month);
  const idanne = Number(req.query.idanne);

  if (!month || !idanne) {
    return res.status(400).json({
      message: "Mois et année académique requis"
    });
  }

  db.query(
    `
    SELECT 
      p.matprof,
      p.nomprof,
      p.prenprof,
      p.statut,
      p.volume_statutaire,
      COALESCE(th.montantth, 0) AS taux_horaire,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS total_heures,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS heures_complementaires,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) * COALESCE(th.montantth, 0) AS montant_total
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    JOIN professeur p ON af.matproff = p.matprof
    LEFT JOIN thoraire th ON p.idth = th.idth
    LEFT JOIN parametrage param ON hr.libheure = param.type_heure
    WHERE hr.statut = 'valide'
      AND hr.idanne = ?
      AND MONTH(hr.datecours) = ?
    GROUP BY p.matprof, p.nomprof, p.prenprof, p.statut, p.volume_statutaire, th.montantth
    ORDER BY p.nomprof
    `,
    [idanne, month],
    (err, rows) => {
      if (err) {
        console.error("❌ ERREUR SQL PAYEMENT :", err);
        return res.status(500).json({
          message: "Erreur SQL",
          sqlMessage: err.sqlMessage
        });
      }
      res.json(rows);
    }
  );
};