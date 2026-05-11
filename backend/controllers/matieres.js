import db from "../db.js";

/* =========================
   LISTE DES MATIERES
   (Admin + RH)
========================= */
export const listMatieres = (req, res) => {
  db.query(
    "SELECT idmat, libmat, volmat FROM matiere ORDER BY libmat",
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
   CREATION MATIERE
   (Admin)
========================= */
export const createMatiere = (req, res) => {
  const { libmat, volmat } = req.body;

  if (!libmat || !volmat) {
    return res.status(400).json({
      success: false,
      message: "Libellé et volume horaire obligatoires"
    });
  }

  db.query(
    "INSERT INTO matiere (libmat, volmat) VALUES (?, ?)",
    [libmat, Number(volmat)],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Creation matiere", req.session.user.iduser]
            );

      res.json({
        success: true,
        idmat: result.insertId,
        message: "✅ Matière créée avec succès"
      });
    }
  );
};
/* =========================
   SEARCH MATIERE
   (Admin + RH)
========================= */
export const searchMatiere = (req, res) => {
  const q = req.query.q;

  if (!q || q.length < 2) {
    return res.json([]);
  }

  db.query(
    "SELECT idmat, libmat, volmat FROM matiere WHERE libmat LIKE ? ORDER BY libmat LIMIT 10",
    [`%${q}%`],
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
   MODIFICATION MATIERE
   (Admin)
========================= */
export const updateMatiere = (req, res) => {
  const idmat = Number(req.params.id);
  const { libmat, volmat } = req.body;

  if (!libmat || !volmat) {
    return res.status(400).json({
      success: false,
      message: "Libellé et volume horaire obligatoires"
    });
  }

  db.query(
    "UPDATE matiere SET libmat=?, volmat=? WHERE idmat=?",
    [libmat, Number(volmat), idmat],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Modification matiere", req.session.user.iduser]
            );

      res.json({
        success: true,
        message: "✅ Matière modifiée avec succès"
      });
    }
  );
};

/* =========================
   SUPPRESSION MATIERE
   (Admin)
========================= */
export const deleteMatiere = (req, res) => {
  const idmat = Number(req.params.id);

  db.query(
    "DELETE FROM matiere WHERE idmat=?",
    [idmat],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Suppression matiere", req.session.user.iduser]
            );

      res.json({
        success: true,
        message: "✅ Matière supprimée avec succès"
      });
    }
  );
};