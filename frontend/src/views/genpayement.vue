<template>
  <div>
    <h1 class="mb-4">État de paiement mensuel</h1>

    <!-- Sélection mois / année académique -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">

          <div class="col-md-3">
            <label class="form-label">Mois</label>
            <select class="form-select" v-model="month">
              <option v-for="m in months" :key="m.value" :value="m.value">
                {{ m.label }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label">Année académique</label>
            <select class="form-select" v-model="idanne">
              <option value="">Sélectionner</option>
              <option v-for="a in annees" :key="a.idanne" :value="a.idanne">
                {{ a.libeanne }}
              </option>
            </select>
          </div>

          <div class="col-md-3 d-grid">
            <button class="btn btn-primary" @click="loadPayement">
              Générer l’état
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Tableau état de paiement -->
    <div class="card">
      <div class="card-header bg-success text-white">
        État de paiement
      </div>

      <div class="table-responsive">
        <table class="table table-bordered mb-0">
          <thead class="table-light">
            <tr>
              <th>Professeur</th>
              <th>Statut</th>
              <th>Total heures (Eq.)</th>
              <th>Vol. Statutaire</th>
              <th>Heures compl.</th>
              <th>Taux horaire</th>
              <th>Montant à payer</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="payements.length === 0">
              <td colspan="7" class="text-center text-muted">
                Aucun paiement pour cette période
              </td>
            </tr>

            <tr v-for="p in payements" :key="p.matprof">
              <td>{{ p.nomprof }} {{ p.prenprof }}</td>
              <td>{{ p.statut }}</td>
              <td>{{ p.total_heures }}</td>
              <td>{{ p.statut === 'Permanent' ? p.volume_statutaire : '-' }}</td>
              <td class="text-primary fw-bold">{{ p.heures_complementaires }}</td>
              <td>{{ formatMoney(p.taux_horaire) }}</td>
              <td class="fw-bold text-success">
                {{ formatMoney(p.montant_total) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Exports -->
      <div class="card-footer d-flex gap-2">
        <button
          class="btn btn-outline-success"
          :disabled="payements.length === 0"
          @click="exportExcel">
          Export Excel
        </button>

        <button
          class="btn btn-outline-danger"
          :disabled="payements.length === 0"
          @click="exportPDF">
          Export PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* Sélecteurs */
const month = ref(new Date().getMonth() + 1);
const idanne = ref("");

const months = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" }
];

/* Données */
const annees = ref([]);
const payements = ref([]);

/* Charger les années académiques */
onMounted(async () => {
  annees.value = (await api.get("/annees")).data;
});

/* Générer l’état */
const loadPayement = async () => {
  if (!idanne.value) {
    alert("Veuillez sélectionner une année académique");
    return;
  }

  payements.value = (
    await api.get(`/payement?month=${month.value}&idanne=${idanne.value}`)
  ).data;
};

/* Utils */
const formatMoney = (val) =>
  new Intl.NumberFormat("fr-FR").format(val) + " FCFA";

/* Export Excel */
const exportExcel = () => {
  const dataToExport = payements.value.map(p => ({
    "Matricule": p.matprof,
    "Professeur": `${p.nomprof} ${p.prenprof}`,
    "Statut": p.statut,
    "Heures Totales (Eq.)": p.total_heures,
    "Volume Statutaire": p.statut === 'Permanent' ? p.volume_statutaire : '-',
    "Heures Complémentaires": p.heures_complementaires,
    "Taux Horaire": p.taux_horaire,
    "Montant à payer": p.montant_total
  }));
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Etat de paiement");
  XLSX.writeFile(wb, `etat_paiement_${month.value}_${idanne.value}.xlsx`);
};

/* Export PDF */
const exportPDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const selectedMonthLabel = months.find(m => m.value === month.value)?.label;
  const selectedYearLabel = annees.value.find(a => a.idanne === idanne.value)?.libeanne;

  // En-tête
  doc.setFontSize(18);
  doc.setTextColor(25, 135, 84); // Success color
  doc.text("ÉTAT DE PAIEMENT MENSUEL", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text(`Période : ${selectedMonthLabel} ${selectedYearLabel}`, 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 14, 30, { align: "right" });

  autoTable(doc, {
    startY: 40,
    head: [["Professeur", "Statut", "Tot. H (Eq)", "Vol. Stat", "H. Compl", "Taux", "Montant"]],
    body: payements.value.map(p => [
      `${p.nomprof} ${p.prenprof}`,
      p.statut,
      p.total_heures,
      p.statut === 'Permanent' ? p.volume_statutaire : '-',
      p.heures_complementaires,
      formatMoney(p.taux_horaire),
      formatMoney(p.montant_total)
    ]),
    theme: 'grid',
    headStyles: { 
      fillColor: [25, 135, 84], 
      textColor: 255,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 'auto' }, // Professeur
      1: { cellWidth: 20, halign: 'center' }, // Statut
      2: { cellWidth: 20, halign: 'center' }, // Tot. H (Eq)
      3: { cellWidth: 20, halign: 'center' }, // Vol. Stat
      4: { cellWidth: 20, halign: 'center', fontStyle: 'bold' }, // H. Compl
      5: { cellWidth: 35, halign: 'right' }, // Taux
      6: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }  // Montant
    },
    styles: { fontSize: 9 },
    didDrawPage: (data) => {
      // Pied de page
      const str = "Page " + doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      const pageHeight = doc.internal.pageSize.height;
      doc.text(str, pageWidth / 2, pageHeight - 10, { align: "center" });
    }
  });

  // Section Signature
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(11);
  doc.setTextColor(40);
  doc.text("Signature du Responsable RH", pageWidth - 60, finalY);
  doc.line(pageWidth - 70, finalY + 15, pageWidth - 14, finalY + 15);

  doc.save(`etat_paiement_${selectedMonthLabel}_${selectedYearLabel}.pdf`);
};
</script>

<style scoped>
h1 {
  color: #198754;
  font-weight: 700;
}
</style>