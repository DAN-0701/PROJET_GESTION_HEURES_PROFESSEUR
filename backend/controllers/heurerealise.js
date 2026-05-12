import db from "../db.js";

/* =========================
   RECUPERER ANNEE ACTIVE
========================= */
const getAnneeActive = (cb) => {
  db.query(
    `
    SELECT idanne
    FROM annee
    WHERE CURDATE() BETWEEN date_debut AND date_fin
    LIMIT 1
    `,
    (err, rows) => {
      if (err) return cb(err);
      if (rows.length === 0) return cb("Aucune année académique active");
      cb(null, rows[0].idanne);
    }
  );
};

/* =========================
   SAISIE DES HEURES (RH)
========================= */
export const saisirHeure = (req, res) => {
  const { idaff, libheure, nbheure, datecours, salle } = req.body;

  if (!idaff || !libheure || !nbheure || !datecours || !salle) {
    return res.status(400).json({
      message: "Tous les champs sont obligatoires"
    });
  }

  getAnneeActive((err, idanne) => {
    if (err) {
      return res.status(400).json({
        message: err
      });
    }

    db.query(
      `
      INSERT INTO heure_realise
      (idaff, libheure, nbheure, statut, datecours, salle, idanne)
      VALUES (?,?,?,?,?,?,?)
      `,
      [
        idaff,
        libheure,
        nbheure,
        "en_attente",
        datecours,
        salle,
        idanne
      ],
      (err) => {
        if (err) {
          // ✅ AJOUT CRUCIAL : afficher la vraie erreur SQL
          console.error("❌ ERREUR SQL INSERT HEURE :", err);
          return res.status(500).json({
            message: "Erreur SQL",
            sqlMessage: err.sqlMessage,
            code: err.code
          });
        }

        db.query(
          "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
          ["saisie des heures", req.session.user.iduser]
        );

        res.json({
          success: true,
          message: "✅ Heures saisies avec succès"
        });
      }
    );
  });
};

/* =========================
   HEURES DU PROF CONNECTÉ
========================= */
export const listHeuresProf = (req, res) => {
  const matprof = req.session.user.matprof;

  db.query(
    `
    SELECT
      hr.idheure,
      m.libmat,
      hr.libheure,
      hr.nbheure,
      hr.datecours,
      hr.statut
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    JOIN matiere m ON af.idmat = m.idmat
    WHERE af.matproff = ?
      AND hr.statut = 'valide'
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

export const dashbord = (req, res) => {
  db.query(
    `
    SELECT 
      COALESCE(SUM(heures_validees), 0) AS heures_validees,
      COALESCE(SUM(heures_en_attente), 0) AS heures_non_validees,
      COALESCE(SUM(montant_total), 0) AS montant_total,
      (
        SELECT COUNT(DISTINCT matprof)
        FROM (
          SELECT p2.matprof
          FROM heure_realise hr2
          JOIN affectation af2 ON hr2.idaff = af2.idaff
          JOIN professeur p2 ON af2.matproff = p2.matprof
          JOIN matiere m2 ON af2.idmat = m2.idmat
          LEFT JOIN parametrage param2 ON hr2.libheure = param2.type_heure
          WHERE hr2.idanne = (SELECT idanne FROM annee WHERE CURDATE() BETWEEN date_debut AND date_fin LIMIT 1)
            AND hr2.statut = 'valide'
          GROUP BY p2.matprof, m2.idmat, m2.volmat, p2.volume_statutaire
          HAVING SUM(hr2.nbheure) > m2.volmat 
             OR (SUM(hr2.nbheure * COALESCE(param2.coefficient, 1.0)) > p2.volume_statutaire AND p2.volume_statutaire > 0)
        ) AS dep_list
      ) AS enseignants_depassement
    FROM (
      SELECT 
        p.matprof,
        SUM(CASE WHEN hr.statut = 'valide' THEN hr.nbheure * COALESCE(param.coefficient, 1.0) ELSE 0 END) AS heures_validees,
        SUM(CASE WHEN hr.statut IN ('en_attente', 'refuse') THEN hr.nbheure * COALESCE(param.coefficient, 1.0) ELSE 0 END) AS heures_en_attente,
        SUM(CASE WHEN hr.statut = 'valide' THEN hr.nbheure * COALESCE(param.coefficient, 1.0) * COALESCE(th.montantth, 0) ELSE 0 END) AS montant_total
      FROM professeur p
      LEFT JOIN thoraire th ON p.idth = th.idth
      JOIN affectation af ON p.matprof = af.matproff
      JOIN heure_realise hr ON af.idaff = hr.idaff
      LEFT JOIN parametrage param ON hr.libheure = param.type_heure
      WHERE hr.idanne = (SELECT idanne FROM annee WHERE CURDATE() BETWEEN date_debut AND date_fin LIMIT 1)
      GROUP BY p.matprof
    ) AS prof_totals
    `,
    (err, rows) => {
      if (err) {
        console.error("❌ ERREUR DASHBOARD RH :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(rows[0]);
    }
  );
};
/* =========================
   LISTE DES HEURES (RH)
========================= */
export const listHeures = (req, res) => {
  db.query(
    `
    SELECT
      hr.idheure,
      p.nomprof,
      p.prenprof,
      m.libmat,
      f.libfil,
      n.libniv,
      hr.libheure,
      hr.nbheure,
      hr.datecours,
      hr.salle,
      hr.statut,
      hr.motif_refus
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    JOIN professeur p ON af.matproff = p.matprof
    JOIN matiere m ON af.idmat = m.idmat
    JOIN filiere f ON af.idfil = f.idfil
    JOIN niveau n ON af.idniv = n.idniv
    WHERE hr.idanne = (
      SELECT idanne
      FROM annee
      WHERE CURDATE() BETWEEN date_debut AND date_fin
      LIMIT 1
    )
    ORDER BY hr.datecours DESC
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

/* =========================
   VALIDATION DES HEURES
========================= */
export const validerHeure = (req, res) => {
  const id = Number(req.params.id);

  db.query(
    `
    UPDATE heure_realise
    SET statut = 'valide', motif_refus = NULL
    WHERE idheure = ?
    `,
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Heure introuvable" });
      }

      db.query(
        "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
        ["validation des heures", req.session.user.iduser]
      );

      res.json({
        success: true,
        message: "✅ Heure validée"
      });
    }
  );
};

/* =========================
   MODIFICATION DES HEURES
========================= */
export const updateHeure = (req, res) => {
  const id = Number(req.params.id);
  const { libheure, nbheure, datecours, salle } = req.body;

  if (!libheure || !nbheure || !datecours || !salle) {
    return res.status(400).json({
      message: "Champs de modification invalides"
    });
  }

  db.query(
    `
    UPDATE heure_realise
    SET libheure = ?, nbheure = ?, datecours = ?, salle = ?
    WHERE idheure = ?
    `,
    [libheure, nbheure, datecours, salle, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Heure introuvable" });
      }

      db.query(
        "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
        ["modification des heures", req.session.user.iduser]
      );

      res.json({
        success: true,
        message: "✅ Heure modifiée avec succès"
      });
    }
  );
};

/* =========================
   SUPPRESSION DES HEURES
========================= */
export const deleteHeure = (req, res) => {
  const id = Number(req.params.id);

  db.query(
    "DELETE FROM heure_realise WHERE idheure = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Heure introuvable" });
      }

      db.query(
        "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
        ["suppression des heures", req.session.user.iduser]
      );

      res.json({
        success: true,
        message: "✅ Heure supprimée"
      });
    }
  );
};

/* =========================
   REINITIALISER UNE HEURE (RH)
========================= */
export const reinitialiserHeure = (req, res) => {
  const id = Number(req.params.id);

  db.query(
    `
    UPDATE heure_realise
    SET statut = 'en_attente', motif_refus = NULL
    WHERE idheure = ?
    `,
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Heure introuvable" });
      }

      db.query(
        "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
        [`réinitialisation de l'heure (ID: ${id})`, req.session.user.iduser]
      );

      res.json({
        success: true,
        message: "✅ Heure remise en attente"
      });
    }
  );
};
