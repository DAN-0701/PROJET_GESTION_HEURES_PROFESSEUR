import mysqldump from "mysqldump";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const backupDatabase = async (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  const fileName = `backup_gestprofesseur_${date}.sql`;
  const backupDir = path.join(__dirname, "../backups");
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  const backupPath = path.join(backupDir, fileName);

  try {
    await mysqldump({
      connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gestprofesseur',
        port: 3306
      },
      dumpToFile: backupPath,
    });

    // Journalisation
    import("../db.js").then(({ default: db }) => {
      db.query(
        "INSERT INTO journallog (action, iduser) VALUES (?, ?)",
        ["Sauvegarde Base de Données", req.session.user.iduser]
      );
    });

    res.download(backupPath, fileName, (err) => {
      if (err) {
        console.error("Erreur lors du téléchargement:", err);
      }
    });
  } catch (error) {
    console.error(`Erreur de backup: ${error.message}`);
    res.status(500).json({ message: "Erreur lors de la sauvegarde." });
  }
};
