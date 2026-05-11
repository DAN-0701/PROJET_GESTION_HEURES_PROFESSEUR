import db from "../db.js";

export const heuresParProfesseur = (req, res) => {
  db.query(
    `
    SELECT 
      p.nomprof,
      p.prenprof,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS total_heures
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    JOIN professeur p ON af.matproff = p.matprof
    LEFT JOIN parametrage param ON hr.libheure = param.type_heure
    WHERE hr.statut = 'valide'
    GROUP BY p.matprof, p.nomprof, p.prenprof
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

export const heuresParType = (req, res) => {
  db.query(
    `
    SELECT hr.libheure, SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS total_heures
    FROM heure_realise hr
    LEFT JOIN parametrage param ON hr.libheure = param.type_heure
    WHERE hr.statut = 'valide'
    GROUP BY hr.libheure
    `,
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json(rows);
    }
  );
};

export const heuresParAnnee = (req, res) => {
  db.query(
    `
    SELECT 
      a.idanne,
      a.libeanne,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS total_heures
    FROM heure_realise hr
    JOIN annee a ON hr.idanne = a.idanne
    LEFT JOIN parametrage param ON hr.libheure = param.type_heure
    WHERE hr.statut = 'valide'
    GROUP BY a.idanne, a.libeanne
    ORDER BY a.idanne
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

export const heuresParDepartement = (req, res) => {
  db.query(
    `
    SELECT 
      d.libdep AS departement,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS total_heures
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    JOIN professeur p ON af.matproff = p.matprof
    JOIN departement d ON p.iddep = d.iddep
    LEFT JOIN parametrage param ON hr.libheure = param.type_heure
    WHERE hr.statut = 'valide'
    GROUP BY d.iddep, d.libdep
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

/* Liste des professeurs avec leurs enseignements */
export const professeursDetails = (req, res) => {
  db.query(
    `
    SELECT 
      p.matprof,
      p.nomprof,
      p.prenprof,
      p.statut,
      p.grade,
      d.libdep,
      (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('matiere', m.libmat, 'filiere', f.libfil, 'niveau', n.libniv, 'volume', m.volmat))
        FROM affectation af
        JOIN matiere m ON af.idmat = m.idmat
        JOIN filiere f ON af.idfil = f.idfil
        JOIN niveau n ON af.idniv = n.idniv
        WHERE af.matproff = p.matprof
      ) as enseignements
    FROM professeur p
    LEFT JOIN departement d ON p.iddep = d.iddep
    `,
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      
      const formatted = rows.map(r => {
        let enseignements = [];
        try {
          if (r.enseignements) {
            enseignements = typeof r.enseignements === 'string' ? JSON.parse(r.enseignements) : r.enseignements;
          }
        } catch (e) {
          console.error("Erreur JSON parse:", e);
        }
        return { ...r, enseignements };
      });
      res.json(formatted);
    }
  );
};

export const heuresParFiliere = (req, res) => {
  db.query(
    `
    SELECT 
      f.libfil AS filiere,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS total_heures
    FROM heure_realise hr
    JOIN affectation af ON hr.idaff = af.idaff
    JOIN filiere f ON af.idfil = f.idfil
    LEFT JOIN parametrage param ON hr.libheure = param.type_heure
    WHERE hr.statut = 'valide'
    GROUP BY f.idfil, f.libfil
    `,
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json(rows);
    }
  );
};

export const heuresParMois = (req, res) => {
  db.query(
    `
    SELECT 
      DATE_FORMAT(hr.datecours, '%Y-%m') as mois,
      SUM(hr.nbheure * COALESCE(param.coefficient, 1.0)) AS total_heures
    FROM heure_realise hr
    LEFT JOIN parametrage param ON hr.libheure = param.type_heure
    WHERE hr.statut = 'valide'
    GROUP BY mois
    ORDER BY mois
    `,
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json(rows);
    }
  );
};