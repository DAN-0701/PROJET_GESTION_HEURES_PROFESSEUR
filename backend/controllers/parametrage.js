import db from "../db.js";

/* Récupérer tous les paramétrages */
export const getParametrages = (req, res) => {
  db.query("SELECT * FROM parametrage", (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });
    res.json(rows);
  });
};

/* Mettre à jour un paramétrage */
export const updateParametrage = (req, res) => {
  const { type_heure, coefficient } = req.body;
  if (!type_heure || coefficient === undefined) {
    return res.status(400).json({ message: "Champs invalides" });
  }

  db.query(
    "UPDATE parametrage SET coefficient = ? WHERE type_heure = ?",
    [coefficient, type_heure],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      
      db.query(
        "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
        [`Modification équivalence ${type_heure}`, req.session.user.iduser]
      );
      
      res.json({ message: "Paramétrage mis à jour avec succès" });
    }
  );
};
