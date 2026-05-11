import db from "../db.js";

/* =========================
   LISTER TOUTES LES ANNEES
   (ADMIN)
========================= */
export const listAnnees = (req, res) => {
  db.query(
    `SELECT *,
  CASE
    WHEN CURDATE() BETWEEN date_debut AND date_fin THEN 'Active'
    WHEN CURDATE() < date_debut THEN 'À venir'
    ELSE 'Terminée'
  END AS statut
FROM annee
ORDER BY date_debut DESC;
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
   RECUPERER L'ANNEE ACTIVE
   (PAR DATE)
========================= */
export const getAnneeActive = (req, res) => {
  db.query(
    `
    SELECT *
    FROM annee
    WHERE CURDATE() BETWEEN date_debut AND date_fin
    LIMIT 1
    `,
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      // Peut retourner null si aucune année active
      res.json(rows[0] || null);
    }
  );
};

/* =========================
   CREER UNE ANNEE
   (ADMIN)
========================= */
export const createAnnee = (req, res) => {
  const { libeanne, date_debut, date_fin } = req.body;

  // ✅ Vérification des champs
  if (!libeanne || !date_debut || !date_fin) {
    return res.status(400).json({
      message: "Tous les champs sont obligatoires"
    });
  }

  // ✅ Vérification logique des dates
  const debut = new Date(date_debut);
  const fin = new Date(date_fin);

  if (fin <= debut) {
    return res.status(400).json({
      message: "La date de fin doit être postérieure à la date de début"
    });
  }

  // ✅ Insertion
  db.query(
    `
    INSERT INTO annee (libeanne, date_debut, date_fin)
    VALUES (?,?,?)
    `,
    [libeanne, date_debut, date_fin],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["creation d'une annee", req.session.user.iduser]
            );
      res.json({
        success: true,
        message: "✅ Année académique créée avec succès"
      });
    }
  );
};

/* =========================
   SUPPRIMER UNE ANNEE
   (ADMIN)
========================= */
export const deleteAnnee = (req, res) => {
  const id = Number(req.params.id);

  db.query(
    "DELETE FROM annee WHERE idanne = ?",
    [id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["suppression d'annee", req.session.user.iduser]
            );
      res.json({
        success: true,
        message: "✅ Année académique supprimée"
      });
    }
  );
};