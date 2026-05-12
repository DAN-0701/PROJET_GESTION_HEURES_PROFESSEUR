import db from "../backend/db.js";

const sql = "ALTER TABLE heure_realise ADD COLUMN motif_refus TEXT AFTER statut;";

db.query(sql, (err) => {
  if (err) {
    if (err.code === 'ER_DUP_COLUMN_NAME') {
      console.log("✅ Column 'motif_refus' already exists.");
    } else {
      console.error("❌ Error adding column:", err);
    }
  } else {
    console.log("✅ Column 'motif_refus' added successfully.");
  }
  process.exit();
});
