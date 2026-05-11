<template>
  <div>
    <h1 class="mb-4">Mes heures réalisées</h1>

    <!-- Boutons de récapitulatif -->
    <div class="mb-3 d-flex gap-2">
      <button class="btn btn-danger" @click="exportPDF">
        📄 Télécharger PDF
      </button>

      <button class="btn btn-success" @click="exportExcel">
        📊 Télécharger Excel
      </button>
    </div>

    <!-- Tableau des heures -->
    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Durée</th>
          <th>Salle</th>
          <th>Statut</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="heures.length === 0">
          <td colspan="5" class="text-center text-muted">
            Aucune heure enregistrée
          </td>
        </tr>

        <tr v-for="h in heures" :key="h.idheure">
          <td>{{ h.datecours }}</td>
          <td>{{ h.libheure }}</td>
          <td>{{ h.nbheure }} h</td>
          <td>{{ h.salle }}</td>
          <td>
            <span
              class="badge"
              :class="h.statut === 'valide'
                ? 'bg-success'
                : 'bg-warning text-dark'">
              {{ h.statut }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const heures = ref([]);

/* Charger le récapitulatif */
onMounted(async () => {
  heures.value = (await api.get("/prof/recap")).data;
});

/* Export PDF */
const exportPDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // En-tête
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text("RÉCAPITULATIF DES HEURES", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 14, 30, { align: "right" });
  
  // Ligne de séparation
  doc.setDrawColor(220);
  doc.line(14, 35, pageWidth - 14, 35);

  autoTable(doc, {
    startY: 40,
    head: [["Date", "Type", "Durée", "Salle", "Statut"]],
    body: heures.value.map(h => [
      h.datecours,
      h.libheure,
      h.nbheure + " h",
      h.salle,
      h.statut
    ]),
    theme: 'striped',
    headStyles: { 
      fillColor: [41, 128, 185], 
      textColor: 255,
      fontSize: 11,
      halign: 'center'
    },
    columnStyles: {
      2: { halign: 'center' },
      4: { halign: 'center' }
    },
    didDrawPage: (data) => {
      // Pied de page
      const str = "Page " + doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    }
  });

  doc.save("mon_recapitulatif_heures.pdf");
};

/* Export Excel */
const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(heures.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Récapitulatif");
  XLSX.writeFile(wb, "mon_recapitulatif.xlsx");
};
</script>