import db from "../db.js";

/* =========================
   MES HEURES (PROFESSEUR)
========================= */
export const mesHeures = (req, res) => {
  const matprof = req.session.user.matprof;

  db.query(
    `
    SELECT
      hr.idheure,
      hr.datecours,
      hr.libheure,
      hr.nbheure,
      hr.salle,
      hr.statut
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    WHERE af.matproff = ?
    ORDER BY hr.datecours DESC
    `,
    [matprof],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(rows);
    }
  );
};
``
/* =========================
   MES STATISTIQUES (PROF)
========================= */
export const mesStatistiques = (req, res) => {
  const matprof = req.session.user.matprof;

  db.query(
    `
    SELECT
      p.statut,
      p.volume_statutaire,
      COALESCE(th.montantth, 0) AS montantth,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS total,
      SUM(CASE WHEN hr.libheure = 'CM' THEN hr.nbheure * COALESCE(param.coefficient, 1.0) ELSE 0 END) AS cm,
      SUM(CASE WHEN hr.libheure = 'TD' THEN hr.nbheure * COALESCE(param.coefficient, 1.0) ELSE 0 END) AS td,
      SUM(CASE WHEN hr.libheure = 'TP' THEN hr.nbheure * COALESCE(param.coefficient, 1.0) ELSE 0 END) AS tp
    FROM professeur p
    LEFT JOIN thoraire th ON p.idth = th.idth
    LEFT JOIN affectation af ON p.matprof = af.matproff
    LEFT JOIN heure_realise hr ON af.idaff = hr.idaff
    LEFT JOIN parametrage param ON hr.libheure = param.type_heure
    WHERE p.matprof = ?
      AND (hr.statut = 'valide' OR hr.statut IS NULL)
    GROUP BY p.matprof, p.statut, p.volume_statutaire, th.montantth
    `,
    [matprof],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      const stats = rows[0] || { total: 0, cm: 0, td: 0, tp: 0, statut: 'Vacataire', volume_statutaire: 0, montantth: 0 };
      
      let montant_total = stats.total * stats.montantth;

      res.json({
        total: stats.total ?? 0,
        cm: stats.cm ?? 0,
        td: stats.td ?? 0,
        tp: stats.tp ?? 0,
        montant_total: montant_total
      });
    }
  );
};

/* =========================
   STATISTIQUES PAR MATIERE & NIVEAU (PROF)
========================= */
export const mesStatsParMatiereNiveau = (req, res) => {
  const matprof = req.session.user.matprof;

  db.query(
    `
    SELECT
      m.libmat AS matiere,
      n.libniv AS niveau,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS total_heures
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    JOIN matiere m ON m.idmat = af.idmat
    JOIN niveau n ON n.idniv = af.idniv
    LEFT JOIN parametrage param ON hr.libheure = param.type_heure
    WHERE af.matproff = ?
      AND hr.statut = 'valide'
    GROUP BY m.idmat, n.idniv, m.libmat, n.libniv
    ORDER BY m.libmat, n.libniv
    `,
    [matprof],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(rows);
    }
  );
};

/* =========================
   MON RÉCAPITULATIF (PROF)
========================= */
export const monRecap = (req, res) => {
  const matprof = req.session.user.matprof;

  db.query(
    `
    SELECT
      hr.datecours,
      hr.libheure,
      hr.nbheure,
      hr.salle,
      hr.statut
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    WHERE af.matproff = ?
    ORDER BY hr.datecours DESC
    `,
    [matprof],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(rows);
    }
  );
};

/* =========================
   HEURES PAR ANNEE ACADEMIQUE (PROF)
========================= */
export const mesStatsParAnnee = (req, res) => {
  const matprof = req.session.user.matprof;

  db.query(
    `
    SELECT
      a.libeanne,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS total_heures
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    JOIN annee a ON hr.idanne = a.idanne
    LEFT JOIN parametrage param ON hr.libheure = param.type_heure
    WHERE af.matproff = ?
      AND hr.statut = 'valide'
    GROUP BY a.idanne, a.libeanne
    ORDER BY a.idanne
    `,
    [matprof],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(rows);
    }
  );
};

/* =========================
   MES HEURES DETAILS PAR MATIERE (PROF)
========================= */
export const mesHeuresDetails = (req, res) => {
  const matprof = req.session.user.matprof;

  db.query(
    `
    SELECT
      hr.idheure,
      hr.datecours,
      hr.libheure,
      hr.nbheure,
      hr.salle,
      hr.statut,
      m.libmat AS matiere,
      m.volmat AS volume,
      f.libfil AS filiere,
      n.libniv AS niveau
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    JOIN matiere m ON m.idmat = af.idmat
    JOIN filiere f ON f.idfil = af.idfil
    JOIN niveau n ON n.idniv = af.idniv
    WHERE af.matproff = ?
      AND hr.statut = 'valide'
    ORDER BY m.libmat, hr.datecours DESC
    `,
    [matprof],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(rows);
    }
  );
};