import db from "../db.js";

/* =========================
   HELPER PROMISE
========================= */
const queryAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

/* =========================
   LISTE DES TAUX HORAIRES
   (Admin + RH)
========================= */
export const listTauxHoraires = async (_req, res) => {
  try {
    const rows = await queryAsync(
      "SELECT idth, libth, montantth FROM thoraire ORDER BY libth"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   SEARCH TAUX HORAIRE
   (Admin + RH)
========================= */
export const searchTauxHoraires = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.length < 1) {
      return res.json([]);
    }

    const rows = await queryAsync(
      "SELECT idth, libth, montantth FROM thoraire WHERE libth LIKE ? ORDER BY libth",
      [`%${q}%`]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   CREATION TAUX HORAIRE
   (Admin)
========================= */
export const createTauxHoraire = async (req, res) => {
  try {
    const { libth, montantth } = req.body;

    if (!libth || montantth === undefined) {
      return res.status(400).json({
        success: false,
        message: "Libellé (grade) et montant obligatoires"
      });
    }

    // Sécurité ENUM
    const valeursAutorisees = ["assistant", "maitre assistant", "professeur"];
    if (!valeursAutorisees.includes(libth)) {
      return res.status(400).json({
        success: false,
        message: "Libellé invalide"
      });
    }

    await queryAsync(
      "INSERT INTO thoraire (libth, montantth) VALUES (?, ?)",
      [libth, Number(montantth)]
    );

    db.query(
      "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
      ["Creation taux horaire", req.session.user.iduser]
    );

    res.json({
      success: true,
      message: "✅ Taux horaire créé avec succès"
    });

  } catch (err) {
    console.error("ERREUR CREATE THORAIRE :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   MODIFICATION TAUX HORAIRE
   (Admin)
========================= */
export const updateTauxHoraire = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { libth, montantth } = req.body;

    if (!libth || montantth === undefined) {
      return res.status(400).json({
        success: false,
        message: "Libellé et montant obligatoires"
      });
    }

    await queryAsync(
      "UPDATE thoraire SET libth=?, montantth=? WHERE idth=?",
      [libth, Number(montantth), id]
    );

    db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Modification taux horaire", req.session.user.iduser]
            );

    res.json({
      success: true,
      message: "✅ Taux horaire modifié avec succès"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   SUPPRESSION TAUX HORAIRE
   (Admin)
========================= */
export const deleteTauxHoraire = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await queryAsync(
      "DELETE FROM thoraire WHERE idth=?",
      [id]
    );

    db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Suppression taux horaire", req.session.user.iduser]
            );

    res.json({
      success: true,
      message: "✅ Taux horaire supprimé avec succès"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};