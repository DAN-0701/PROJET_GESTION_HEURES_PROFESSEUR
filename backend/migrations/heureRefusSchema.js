import db from "../db.js";

const columnExists = (table, column, cb) => {
  db.query(
    `
    SELECT COUNT(*) AS count
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
    `,
    [table, column],
    (err, rows) => {
      if (err) return cb(err);
      cb(null, rows[0].count > 0);
    }
  );
};

export const ensureHeureRefusSchema = () => {
  columnExists("heure_realise", "motif_refus", (err, exists) => {
    if (err) {
      console.error("Erreur vérification colonne motif_refus :", err.message);
      return;
    }

    if (!exists) {
      db.query(
        "ALTER TABLE heure_realise ADD COLUMN motif_refus TEXT NULL AFTER statut",
        (alterErr) => {
          if (alterErr) {
            console.error("Erreur ajout colonne motif_refus :", alterErr.message);
          } else {
            console.log("Colonne motif_refus ajoutée à heure_realise");
          }
        }
      );
    }
  });

  db.query(
    "ALTER TABLE heure_realise MODIFY statut ENUM('valide', 'en_attente', 'refuse') NOT NULL DEFAULT 'en_attente'",
    (err) => {
      if (err) {
        console.error("Erreur mise à jour statut heure_realise :", err.message);
      }
    }
  );
};
