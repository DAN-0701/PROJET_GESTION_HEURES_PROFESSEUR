import db from "../db.js";
import bcrypt from "bcryptjs";

export const login = (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Body reçu :", req.body);

  // 1️⃣ Chercher l'utilisateur
  db.query(
    "SELECT * FROM utilisateur WHERE emailuser = ?",
    [email],
    async (err, users) => {
      if (err) {
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (users.length === 0) {
        return res.status(401).json({ message: "Email incorrect" });
      }

      const user = users[0];
      const storedPassword = user.passuser || "";
      const isHashed = storedPassword.startsWith("$2");

      // 2️⃣ Vérifier le mot de passe
      const passwordOK = isHashed
        ? await bcrypt.compare(password, storedPassword)
        : password === storedPassword;

      if (!passwordOK) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // 3️⃣ Créer la session (base)
      req.session.user = {
        iduser: user.iduser,
        role: user.roleuser,
      };
      const forceChangePassword = user.first_login === 1;
      // 4️⃣ SI PROFESSEUR → charger le profil
      if (user.roleuser === "professeur") {
        return getProfesseurProfile(req, res,user.iduser,forceChangePassword);
      }
      
      // 5️⃣ Autres rôles
      return res.json({
        iduser: user.iduser,
        role: user.roleuser,
        nom: user.nomuser,
        prenom: user.prenuser,
        forceChangePassword,
      });
    }
  );
};
const getProfesseurProfile = (req, res, iduser, forceChangePassword) => {
  db.query(
    `
      SELECT 
        matprof,
        nomprof,
        prenprof,
        grade,
        statut
      FROM professeur
      WHERE iduser = ?
    `,
    [iduser],
    (err, profs) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur serveur (profil professeur)",
        });
      }

      if (profs.length === 0) {
        return res.status(404).json({
          message: "Profil professeur introuvable",
        });
      }

      const prof = profs[0];

      // enrichir la session
      req.session.user.matprof = prof.matprof;

      // réponse frontend
      return res.json({
        iduser: req.session.user.iduser,
        role: "professeur",

        matprof: prof.matprof,

        nom: prof.nomprof,
        prenom: prof.prenprof,
        grade: prof.grade,
        statut: prof.statut,
        forceChangePassword,
      });
    }
  );
};
