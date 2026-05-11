import db from "../db.js";

/* =========================
   RÉCUPÉRER ANNÉE ACTIVE
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
   LISTE DES AFFECTATIONS
========================= */
export const listAffectations = (req, res) => {
  db.query(
    `
    SELECT 
      a.idaff,

      -- professeur
      a.matproff,
      p.nomprof,
      p.prenprof,
      p.iddep,

      -- matière
      a.idmat,
      m.libmat,

      -- filière
      a.idfil,
      f.libfil,

      -- niveau
      a.idniv,
      n.libniv,

      -- année
      a.idanne,
      an.libeanne

    FROM affectation a
    JOIN professeur p ON a.matproff = p.matprof
    JOIN matiere m ON a.idmat = m.idmat
    JOIN filiere f ON a.idfil = f.idfil
    JOIN niveau n ON a.idniv = n.idniv
    JOIN annee an ON a.idanne = an.idanne

    ORDER BY p.nomprof
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
   CRÉATION AFFECTATION
========================= */
export const createAffectation = (req, res) => {
  const { matproff, idmat, idfil, idniv, iddep } = req.body;

  if (!matproff || !idmat || !idfil || !idniv || !iddep) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires" });
  }

  getAnneeActive((err, idanne) => {
    if (err) return res.status(400).json({ message: err });

    // 1️⃣ Mise à jour du département du professeur
    db.query(
      "UPDATE professeur SET iddep=? WHERE matprof=?",
      [iddep, matproff],
      (err) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });

        // 2️⃣ Création affectation
        db.query(
          `
          INSERT INTO affectation
          (matproff, idmat, idfil, idniv, idanne)
          VALUES (?,?,?,?,?)
          `,
          [matproff, idmat, idfil, idniv, idanne],
          (err) => {
            if (err) return res.status(500).json({ message: "Erreur serveur" });

            // ✅ LOG SIMPLE ET PROPRE
            db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Création affectation", req.session.user.iduser]
            );

            res.json({
              success: true,
              message: "✅ Affectation créée"
            });
          }
        );
      }
    );
  });
};
//UPDATE AFFECTATION
export const updateAffectation = (req, res) => {
  const id = Number(req.params.id);
  const { idmat, idfil, idniv } = req.body;

  if (!idmat || !idfil || !idniv) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  db.query(
    `
    UPDATE affectation
    SET idmat=?, idfil=?, idniv=?
    WHERE idaff=?
    `,
    [idmat, idfil, idniv, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Affectation introuvable" });
      }

      // ✅ LOG SIMPLE
      db.query(
        "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
        ["Modification affectation", req.session.user.iduser]
      );

      res.json({ success: true, message: "✅ Affectation modifiée" });
    }
  );
};

/* =========================
   SUPPRESSION AFFECTATION
========================= */
export const deleteAffectation = (req, res) => {
  const id = Number(req.params.id);

  db.query(
    "DELETE FROM affectation WHERE idaff=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Affectation introuvable" });
      }

      // ✅ LOG APRÈS SUPPRESSION
      db.query(
        "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
        [
          `Suppression affectation`, req.session.user.iduser
        ]
      );

      res.json({ success: true, message: "✅ Affectation supprimée" });
    }
  );
};
export const isAdminOrRh = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const role = req.session.user.role;
  if (role === "admin" || role === "rh") {
    next();
  } else {
    return res.status(403).json({ message: "Accès interdit" });
  }
};
