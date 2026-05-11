import db from "../db.js";
import bcrypt from "bcryptjs";

const normalizeRole = (role) => {
  const r = String(role ?? "").trim().toLowerCase();
  if (["admin", "administrateur", "administrateurs"].includes(r)) return "administrateur";
  if (["prof", "professeur", "professeurs"].includes(r)) return "professeur";
  if (["rh", "ressource humaine", "ressources humaines"].includes(r)) return "ressource humaine";
  return r;
};

//createadmin
export const createadmin = (req, res) => {
  const { nom, prenom, email, role } = req.body;
  const roleNorm = normalizeRole(role);
  const loginone=1
  // Vérification existence
  db.query(
    "SELECT * FROM utilisateur WHERE emailuser = ? OR (nomuser = ? AND prenuser = ?)",
    [email, nom, prenom],
    (err, result) => {
      if (err) return res.json({ success: false, message: "Erreur serveur", error: err });

      if (result.length > 0) {
        return res.json({ success: false, message: "Cet admin existe déjà" });
      }

      const hashedPass = bcrypt.hashSync("1234567", 10);

      db.query(
        "INSERT INTO utilisateur (nomuser, prenuser, emailuser, passuser, roleuser,first_login) VALUES (?,?,?,?,?,?)",
        [nom, prenom, email, hashedPass, roleNorm,loginone],
        (err, data) => {
          if (err) return res.json({ success: false, message: "Erreur lors de l'insertion", error: err });
          // ✅ LOG SIMPLE ET PROPRE
            db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Création administrateur", req.session.user.iduser]
            );
          return res.json({
            success: true,
            message: "Utilisateur créé avec succès (mot de passe par défaut: 1234567)",
            id: data.insertId,
          });
        }
      );
    }
  );
};

//search admin
export const searchadmin = (req, res) => {
  const query = req.query.q; // texte tapé par l'utilisateur
  db.query(
    "SELECT iduser, nomuser, prenuser, emailuser, roleuser FROM utilisateur WHERE (nomuser LIKE ? OR prenuser LIKE ?) AND roleuser = 'administrateur'",
    [`%${query}%`, `%${query}%`],
    (err, result) => {
      if (err) return res.json({ success: false, message: "Erreur serveur" });
      console.log("Résultat SQL :", result);
      res.json(result); // renvoie un tableau de suggestions
    }
  );
};
//liste des admins
export const listadmin=(req,res)=>{
  db.query(`SELECT iduser,nomuser,prenuser,emailuser,roleuser FROM utilisateur 
    WHERE roleuser='administrateur'
    ORDER BY iduser`,(err,data)=>{
    if(err)return res.status(500).json({message:"erreur serveur"})
    console.log(data)
    res.json(data)
  })
}
//update admin
export const updateadmin = (req, res) => {
  const id = Number(req.params.id);
  const { nom, prenom, email, role } = req.body;
  db.query(
    "UPDATE utilisateur SET nomuser=?, prenuser=?, emailuser=?, roleuser=? WHERE iduser=?",
    [nom, prenom, email, role, id],
    (err, result) => {
      if (err) return res.json({ success: false, message: "Erreur serveur" });
      // ✅ LOG SIMPLE ET PROPRE
            db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Modification administrateur", req.session.user.iduser]
            );
      res.json({ success: true, message: "Admin mis à jour avec succès" });
    }
  );
};
//delete admin
export const deleteadmin = (req, res) => {
  const id = Number(req.params.id);
  db.query("DELETE FROM utilisateur WHERE iduser = ?", [id], (err, result) => {
    if (err) return res.json({ success: false, message: "Erreur serveur" });
    // ✅ LOG SIMPLE ET PROPRE
            db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["Suppression administrateur", req.session.user.iduser]
            );
    res.json({ success: true, message: "Admin supprimé avec succès" });
  });
};