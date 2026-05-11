import bcrypt from "bcryptjs";
import db from "../db.js";

export const changePassword = async (req, res) => {
  // ✅ Vérification session
   console.log(req.session.user.iduser)
  if (!req.session?.user?.iduser) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  // ✅ EXTRACTION MANQUANTE (🔥 BUG 🔥)
  const iduser = req.session.user.iduser;
  console.log(iduser)
  const { newPassword } = req.body;
  console.log(newPassword)
  if (!newPassword) {
    return res.status(400).json({
      message: "Mot de passe manquant"
    });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre, un symbole et 8 caractères minimum"
    });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    db.query(
      `
      UPDATE utilisateur
      SET passuser = ?, first_login = 0
      WHERE iduser = ?
      `,
      [hashed, iduser],
      (err) => {
        if (err) {
          console.error("DB error:", err);
          return res.status(500).json({ message: "Erreur serveur" });
        }
        db.query(
              "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
              ["changement de mot de passe", req.session.user.iduser]
            );
        res.json({ success: true });
      }
    );
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ message})
  }}