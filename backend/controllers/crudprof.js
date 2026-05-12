
import db from "../db.js";
import bcrypt from "bcryptjs"

// CREATE PROFESSEUR

export const createprof = (req, res) => {
  const { nom, prenom, email, grade, statut, volume_statutaire } = req.body;
  const loginone=1

  if (!nom || !prenom || !email || !grade || !statut) {
    return res.status(400).json({
      success: false,
      message: "Tous les champs sont obligatoires"
    });
  }

  const hashedPass = bcrypt.hashSync("1234567", 10);

  // 1️⃣ Vérifier existence utilisateur
  db.query(
    "SELECT iduser FROM utilisateur WHERE emailuser = ?",
    [email],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      if (rows.length > 0) {
        return res.status(400).json({ message: "Utilisateur déjà existant" });
      }

      // 2️⃣ Créer utilisateur
      db.query(
        `INSERT INTO utilisateur
         (nomuser, prenuser, emailuser, passuser, roleuser, first_login)
         VALUES (?,?,?,?,?,?)`,
        [nom, prenom, email, hashedPass, "professeur", loginone],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Erreur création utilisateur" });

          const iduser = result.insertId;

          // 3️⃣ Récupérer le taux horaire correspondant au grade
          db.query(
            "SELECT idth FROM thoraire WHERE libth = ? LIMIT 1",
            [grade],
            (err, tauxRows) => {
              if (err) return res.status(500).json({ message: "Erreur récupération taux horaire" });

              if (tauxRows.length === 0) {
                return res.status(400).json({
                  message: `Aucun taux horaire défini pour le grade : ${grade}`
                });
              }

              const idth = tauxRows[0].idth;

              // 4️⃣ Créer professeur avec taux appliqué
              db.query(
                `INSERT INTO professeur
                 (nomprof, prenprof, grade, statut, volume_statutaire, iddep, iduser, idth)
                 VALUES (?,?,?,?,?,?,?,?)`,
                [
                  nom,
                  prenom,
                  grade,
                  statut,
                  volume_statutaire || 0,
                  null,   // département plus tard
                  iduser,
                  idth    // ✅ taux horaire auto
                ],
                (err) => {
                  if (err) return res.status(500).json({ message: "Erreur création professeur" });
                  
                  db.query(
                    "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
                    ["creation professeur", req.session.user.iduser]
                  );

                  res.json({
                    success: true,
                    message: "✅ Professeur créé avec taux horaire automatiquement appliqué"
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};
// search professeur
export const searchprof = (req, res) => {
  const query = req.query.q;

  if (!query || query.length < 2) {
    return res.json([]);
  }

  db.query(
    `
    SELECT 
      u.iduser,
      u.nomuser AS nomprof,
      u.prenuser AS prenprof,
      u.emailuser AS email,
      u.roleuser,
      p.matprof,
      p.grade,
      p.statut,
      p.volume_statutaire
    FROM utilisateur u
    JOIN professeur p ON u.iduser = p.iduser
    WHERE (u.nomuser LIKE ? OR u.prenuser LIKE ?)
      AND u.roleuser = 'professeur'
    LIMIT 5
    `,
    [`%${query}%`, `%${query}%`],
    (err, result) => {
      if (err) {
        return res.json({ success: false, message: "Erreur serveur" });
      }
      console.log("Résultat prof :", result);
      res.json(result);
    }
  );
};
// update professeur
export const updateprof = (req, res) => {
  const id = Number(req.params.id);
  const { nom, prenom, email, grade, statut, volume_statutaire } = req.body;

  // update utilisateur
  db.query(
    "UPDATE utilisateur SET nomuser=?, prenuser=?, emailuser=? WHERE iduser=?",
    [nom, prenom, email, id],
    (err) => {
      if (err) {
        return res.json({ success: false, message: "Erreur mise à jour utilisateur" });
      }

      // update professeur
      db.query(
        "UPDATE professeur SET grade=?, statut=?, volume_statutaire=? WHERE iduser=?",
        [grade, statut, volume_statutaire || 0, id],
        (err) => {
          if (err) {
            return res.json({ success: false, message: "Erreur mise à jour professeur" });
          }

          db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Modification professeur", req.session.user.iduser]
            );

          res.json({ success: true, message: "Professeur mis à jour avec succès" });
        }
      );
    }
  );
};

// GET ALL PROFESSEURS (DASHBOARD)
export const getAllProfesseurs = (req, res) => {
  db.query(
    `
    SELECT
      p.iduser,
      p.matprof,
      p.nomprof,
      p.prenprof,
      u.emailuser AS email,
      p.grade,
      p.statut,
      p.volume_statutaire
    FROM professeur p
    JOIN utilisateur u ON p.iduser = u.iduser
    `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(result);
    }
  );
};


// delete professeur
export const deleteprof = (req, res) => {
  const id = Number(req.params.id);
  // suppression professeur
  db.query(
    "DELETE FROM professeur WHERE iduser=?",
    [id],
    (err) => {
      if (err) {
        return res.json({ success: false, message: "Erreur suppression professeur" });
      }
      // suppression utilisateur
      db.query(
        "DELETE FROM utilisateur WHERE iduser=?",
        [id],
        (err) => {
          if (err) {
            return res.json({ success: false, message: "Erreur suppression utilisateur" });
          }

          db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Suppression professeur", req.session.user.iduser]
            );

          res.json({ success: true, message: "Professeur supprimé avec succès" });
        }
      );
    }
  );
};

// IMPORT PROFESSEURS
export const importProfesseurs = async (req, res) => {
  const { professeurs } = req.body; // Un tableau d'objets

  if (!professeurs || !Array.isArray(professeurs)) {
    return res.status(400).json({ message: "Données d'importation invalides" });
  }

  const results = {
    success: 0,
    errors: [],
    skipped: 0
  };

  const defaultPass = bcrypt.hashSync("1234567", 10);

  // Utilisation d'une boucle for...of pour gérer les promesses séquentiellement (plus sûr avec MySQL2 callbacks)
  for (const prof of professeurs) {
    const { nom, prenom, email, grade, statut, volume_statutaire } = prof;

    if (!nom || !prenom || !email || !grade || !statut) {
      results.errors.push(`Champs manquants pour ${email || 'inconnu'}`);
      continue;
    }

    try {
      // 1. Vérifier si l'utilisateur existe déjà
      const [existingUser] = await db.promise().query("SELECT iduser FROM utilisateur WHERE emailuser = ?", [email]);
      
      if (existingUser.length > 0) {
        results.skipped++;
        continue;
      }

      // 2. Créer l'utilisateur
      const [userResult] = await db.promise().query(
        "INSERT INTO utilisateur (nomuser, prenuser, emailuser, passuser, roleuser, first_login) VALUES (?,?,?,?,?,?)",
        [nom, prenom, email, defaultPass, "professeur", 1]
      );
      const iduser = userResult.insertId;

      // 3. Récupérer le taux horaire
      const [tauxRows] = await db.promise().query("SELECT idth FROM thoraire WHERE libth = ? LIMIT 1", [grade]);
      
      if (tauxRows.length === 0) {
        // Si grade non trouvé, on supprime l'utilisateur créé pour rester propre
        await db.promise().query("DELETE FROM utilisateur WHERE iduser = ?", [iduser]);
        results.errors.push(`Grade invalide '${grade}' pour ${email}`);
        continue;
      }
      const idth = tauxRows[0].idth;

      // 4. Créer le professeur
      await db.promise().query(
        "INSERT INTO professeur (nomprof, prenprof, grade, statut, volume_statutaire, iddep, iduser, idth) VALUES (?,?,?,?,?,?,?,?)",
        [nom, prenom, grade, statut, volume_statutaire || 0, null, iduser, idth]
      );

      results.success++;
    } catch (err) {
      console.error(`Erreur import ${email}:`, err);
      results.errors.push(`Erreur technique pour ${email}`);
    }
  }

  // Journalisation
  if (results.success > 0) {
    db.query("INSERT INTO journallog (action, iduser) VALUES (?, ?)", 
      [`Importation de ${results.success} professeurs`, req.session.user.iduser]
    );
  }

  res.json({
    success: true,
    message: `Importation terminée : ${results.success} créés, ${results.skipped} ignorés (doublons), ${results.errors.length} erreurs.`,
    details: results
  });
};