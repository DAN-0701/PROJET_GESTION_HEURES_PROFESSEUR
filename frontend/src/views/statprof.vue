<template>
  <div>
    <h1 class="mb-4">Mes statistiques</h1>

    <div class="row g-4">
      <!-- 🔵 Camembert : Répartition par type -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Répartition des heures par type
          </div>
          <div class="card-body d-flex justify-content-center">
            <div style="width:120px;height:120px;">
              <canvas
                ref="typeChart"
                style="width:100%;height:100%;"
              ></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rapport par matière -->
    <div class="card mt-4">
      <div class="card-header bg-primary text-white">
        <i class="bi bi-journal-text me-2"></i>Rapport des heures validées par matière
      </div>
      <div class="card-body">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Matière</th>
              <th>Niveau</th>
              <th>Heures Validées</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in statsMatiere" :key="stat.matiere + stat.niveau">
              <td>{{ stat.matiere }}</td>
              <td>{{ stat.niveau }}</td>
              <td>{{ stat.total_heures }} h</td>
              <td>
                <button class="btn btn-sm btn-info text-white" @click="showModal(stat.matiere)">
                  <i class="bi bi-file-earmark-text"></i> Rapport par matière
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Rapport par Matière -->
    <div class="modal fade" id="rapportModal" tabindex="-1" ref="rapportModalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" v-if="selectedMatiere">
          <div class="modal-header">
            <h5 class="modal-title">Rapport détaillé - {{ selectedMatiere }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <table class="table table-sm mt-3">
              <thead>
                <tr>
                  <th>Filière</th>
                  <th>Niveau</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Heures</th>
                  <th>Salle</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="detail in filteredDetails" :key="detail.idheure">
                  <td>{{ detail.filiere }}</td>
                  <td>{{ detail.niveau }}</td>
                  <td>{{ new Date(detail.datecours).toLocaleDateString('fr-FR') }}</td>
                  <td>{{ detail.libheure }}</td>
                  <td>{{ detail.nbheure }}</td>
                  <td>{{ detail.salle }}</td>
                </tr>
                <tr v-if="filteredDetails.length === 0">
                  <td colspan="6" class="text-center text-muted">Aucune heure enregistrée</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { Chart } from "chart.js/auto";
import api from "../services/api.js";
import { Modal } from "bootstrap";

const typeChart = ref(null);

const statsMatiere = ref([]);
const heuresDetails = ref([]);
const selectedMatiere = ref(null);
const rapportModalRef = ref(null);
let modalInstance = null;

let pieInstance = null;

const filteredDetails = computed(() => {
  if (!selectedMatiere.value) return [];
  return heuresDetails.value.filter(h => h.matiere === selectedMatiere.value);
});

const showModal = (matiere) => {
  selectedMatiere.value = matiere;
  if (!modalInstance) {
    modalInstance = new Modal(rapportModalRef.value);
  }
  modalInstance.show();
};

onMounted(async () => {
  /* =========================
     CAMEMBERT : CM / TD / TP
     ========================= */
  const stats = (await api.get("/prof/statistiques")).data;
  
  const resMatiere = await api.get("/prof/statistiques/details");
  statsMatiere.value = resMatiere.data;

  const resDetails = await api.get("/prof/statistiques/rapport-details");
  heuresDetails.value = resDetails.data;

  const pieData = [
    { label: "CM", value: stats.cm ?? 0, color: "#198754" },
    { label: "TD", value: stats.td ?? 0, color: "#ffc107" },
    { label: "TP", value: stats.tp ?? 0, color: "#dc3545" }
  ].filter(p => p.value > 0);

  pieInstance?.destroy();
  pieInstance = new Chart(typeChart.value, {
    type: "pie",
    data: {
      labels: pieData.map(p => p.label),
      datasets: [{
        data: pieData.map(p => p.value),
        backgroundColor: pieData.map(p => p.color)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
});
</script>