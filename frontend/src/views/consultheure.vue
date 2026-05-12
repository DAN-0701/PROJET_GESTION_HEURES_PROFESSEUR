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
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="heures.length === 0">
          <td colspan="6" class="text-center text-muted">
            Aucune heure enregistrée
          </td>
        </tr>

        <tr v-for="h in heures" :key="h.idheure">
          <td>{{ h.datecours }}</td>
          <td>{{ h.libheure }}</td>
          <td>{{ h.nbheure }} h</td>
          <td>{{ h.salle }}</td>
          <td>
            <div class="d-flex flex-column">
              <span
                class="badge"
                :class="getStatusBadgeClass(h.statut)">
                {{ h.statut }}
              </span>
              <small v-if="h.statut === 'refuse' && h.motif_refus" class="text-danger mt-1">
                Motif: {{ h.motif_refus }}
              </small>
            </div>
          </td>
          <td>
            <button 
              v-if="h.statut === 'valide'"
              class="btn btn-sm btn-outline-danger"
              @click="prepareRefusal(h)"
            >
              Refuser
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de Refus -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h4>Refuser ces heures</h4>
        <p>Veuillez préciser le motif du refus pour : <strong>{{ selectedHeure.datecours }} ({{ selectedHeure.nbheure }}h)</strong></p>
        
        <textarea 
          v-model="motifRefus" 
          class="form-control mb-3" 
          rows="3" 
          placeholder="Ex: La durée est incorrecte, je n'ai pas fait ce cours..."
        ></textarea>

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-secondary" @click="showModal = false">Annuler</button>
          <button class="btn btn-danger" :disabled="!motifRefus" @click="confirmRefusal">
            Confirmer le refus
          </button>
        </div>
      </div>
    </div>

    <!-- Alert Success/Error -->
    <div v-if="message" :class="['alert mt-3', isSuccess ? 'alert-success' : 'alert-danger']">
      {{ message }}
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const heures = ref([]);
const showModal = ref(false);
const selectedHeure = ref(null);
const motifRefus = ref("");
const message = ref("");
const isSuccess = ref(true);

const loadHeures = async () => {
  heures.value = (await api.get("/prof/recap")).data;
};

/* Charger le récapitulatif */
onMounted(loadHeures);

const getStatusBadgeClass = (statut) => {
  switch (statut) {
    case "valide": return "bg-success";
    case "refuse": return "bg-danger";
    case "en_attente": return "bg-warning text-dark";
    default: return "bg-secondary";
  }
};

const prepareRefusal = (h) => {
  selectedHeure.value = h;
  motifRefus.value = "";
  showModal.value = true;
};

const confirmRefusal = async () => {
  try {
    const res = await api.put(`/prof/heures/${selectedHeure.value.idheure}/refuser`, {
      motif: motifRefus.value
    });
    
    if (res.data.success) {
      isSuccess.value = true;
      message.value = res.data.message;
      showModal.value = false;
      await loadHeures(); // Recharger la liste
    }
  } catch (error) {
    isSuccess.value = false;
    message.value = error.response?.data?.message || "Erreur lors du refus";
  }
};

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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white !important;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.modal-content h4 {
  margin-bottom: 1rem;
  color: #dc3545;
}
</style>