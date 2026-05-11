import db from "../db.js";
// liste prof
export const listProfesseurs = (req, res) => {
  db.query(
    "SELECT matprof, nomprof, prenprof FROM professeur ORDER BY nomprof",
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json(rows);
    }
  );
};


/* =========================
   FILIERES
========================= */
export const listFilieres = (req, res) => {
  db.query(
    "SELECT idfil, libfil FROM filiere ORDER BY libfil",
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json(rows);
    }
  );
};

export const createFiliere = (req, res) => {
  const { libfil } = req.body;

  if (!libfil) {
    return res.status(400).json({ message: "Libellé filière obligatoire" });
  }

  db.query(
    "INSERT INTO filiere (libfil) VALUES (?)",
    [libfil],
    (err) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Creation de filiere", req.session.user.iduser]
            );
      res.json({ success: true, message: "✅ Filière créée" });
    }
  );
};

/* =========================
   NIVEAUX
========================= */
export const listNiveaux = (req, res) => {
  db.query(
    "SELECT idniv, libniv FROM niveau ORDER BY libniv",
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json(rows);
    }
  );
};

export const createNiveau = (req, res) => {
  const { libniv } = req.body;

  if (!libniv) {
    return res.status(400).json({ message: "Libellé niveau obligatoire" });
  }

  db.query(
    "INSERT INTO niveau (libniv) VALUES (?)",
    [libniv],
    (err) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Creation de niveau", req.session.user.iduser]
            );
      res.json({ success: true, message: "✅ Niveau créé" });
    }
  );
};

/* =========================
   DEPARTEMENTS
========================= */
export const listDepartements = (req, res) => {
  db.query(
    "SELECT iddep, libdep FROM departement ORDER BY libdep",
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json(rows);
    }
  );
};

export const createDepartement = (req, res) => {
  const { libdep } = req.body;

  if (!libdep) {
    return res.status(400).json({ message: "Libellé département obligatoire" });
  }

  db.query(
    "INSERT INTO departement (libdep) VALUES (?)",
    [libdep],
    (err) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Creation de departement", req.session.user.iduser]
            );
      res.json({ success: true, message: "✅ Département créé" });
    }
  );
};
