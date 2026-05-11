<template>
  <div class="container-fluid">

    <div class="page-header mb-4">
      <h2><i class="bi bi-bar-chart-line-fill me-2"></i>Graphiques des heures</h2>
      <p class="text-muted mb-0">Répartition visuelle des heures enseignants</p>
    </div>

    <div class="row g-4 mt-2">

      <!-- Heures par professeur -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <i class="bi bi-people-fill me-2"></i>Heures par professeur
          </div>
          <div class="card-body">
            <div class="chart-wrapper chart-bar">
              <canvas ref="chartProf"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Heures par type -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-success text-white">
            <i class="bi bi-pie-chart-fill me-2"></i>Répartition des heures par type
          </div>
          <div class="card-body">
            <div class="chart-wrapper chart-pie">
              <canvas ref="chartType"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Heures par département -->
      <div class="col-md-12 mt-4">
        <div class="card">
          <div class="card-header bg-info text-white">
            <i class="bi bi-building me-2"></i>Statistiques par département
          </div>
          <div class="card-body">
            <div class="chart-wrapper chart-bar">
              <canvas ref="chartDep"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Heures par Filière -->
      <div class="col-md-6 mt-4">
        <div class="card">
          <div class="card-header bg-warning text-dark">
            <i class="bi bi-diagram-3-fill me-2"></i>Répartition par Filière
          </div>
          <div class="card-body">
            <div class="chart-wrapper chart-bar">
              <canvas ref="chartFiliere"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Évolution Mensuelle -->
      <div class="col-md-6 mt-4">
        <div class="card">
          <div class="card-header bg-dark text-white">
            <i class="bi bi-calendar-event-fill me-2"></i>Évolution Mensuelle
          </div>
          <div class="card-body">
            <div class="chart-wrapper chart-bar">
              <canvas ref="chartMois"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des professeurs -->
      <div class="col-md-12 mt-4">
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <i class="bi bi-list-ul me-2"></i>Liste des professeurs
          </div>
          <div class="card-body">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Nom & Prénom</th>
                  <th>Département</th>
                  <th>Statut</th>
                  <th>Grade</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prof in professeurs" :key="prof.matprof">
                  <td>{{ prof.nomprof }} {{ prof.prenprof }}</td>
                  <td>{{ prof.libdep }}</td>
                  <td>{{ prof.statut }}</td>
                  <td>{{ prof.grade }}</td>
                  <td>
                    <button class="btn btn-sm btn-info text-white" @click="showModal(prof)">
                      <i class="bi bi-eye"></i> Fiche individuelle
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Fiche Professeur -->
    <div class="modal fade" id="profModal" tabindex="-1" ref="profModalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" v-if="selectedProf">
          <div class="modal-header">
            <h5 class="modal-title">Fiche de {{ selectedProf.nomprof }} {{ selectedProf.prenprof }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Statut:</strong> {{ selectedProf.statut }}</p>
            <p><strong>Grade:</strong> {{ selectedProf.grade }}</p>
            <p><strong>Département:</strong> {{ selectedProf.libdep }}</p>
            <hr>
            <h6>Matières enseignées</h6>
            <table class="table table-sm mt-3">
              <thead>
                <tr>
                  <th>Matière</th>
                  <th>Filière</th>
                  <th>Niveau</th>
                  <th>Volume (H)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(ens, index) in selectedProf.enseignements" :key="index">
                  <td>{{ ens.matiere }}</td>
                  <td>{{ ens.filiere }}</td>
                  <td>{{ ens.niveau }}</td>
                  <td>{{ ens.volume }}</td>
                </tr>
                <tr v-if="!selectedProf.enseignements || selectedProf.enseignements.length === 0">
                  <td colspan="4" class="text-center text-muted">Aucun enseignement assigné</td>
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
import { ref, onMounted, nextTick } from "vue";
import api from "../services/api.js";
import { Modal } from "bootstrap";
import {
  Chart,
  BarController,
  BarElement,
  PieController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  PieController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController
);

const chartProf = ref(null);
const chartType = ref(null);
const chartDep = ref(null);
const chartFiliere = ref(null);
const chartMois = ref(null);

let profChart = null;
let typeChart = null;
let depChart = null;
let filiereChart = null;
let moisChart = null;

const statsProf = ref([]);
const statsType = ref([]);
const departements = ref([]);
const professeurs = ref([]);
const filieres = ref([]);
const mensuelles = ref([]);

const selectedProf = ref(null);
const profModalRef = ref(null);
let modalInstance = null;

const showModal = (prof) => {
  selectedProf.value = prof;
  if (!modalInstance) {
    modalInstance = new Modal(profModalRef.value);
  }
  modalInstance.show();
};

/* options communes */
const baseOptions = {
  responsive: true,
  animation: false,
  plugins: {
    legend: {
      labels: {
        font: { family: 'Inter', size: 12 }
      }
    },
    tooltip: {
      bodyFont: { family: 'Inter', size: 12 }
    }
  }
};

const loadCharts = async () => {
  const [resProfStats, resTypeStats, resDep, resProfDetails, resFiliere, resMois] = await Promise.all([
    api.get("/stats/professeurs"),
    api.get("/stats/types"),
    api.get("/stats/departements"),
    api.get("/stats/professeurs-details"),
    api.get("/stats/filieres"),
    api.get("/stats/mensuelles")
  ]);

  statsProf.value = resProfStats.data;
  statsType.value = resTypeStats.data;
  departements.value = resDep.data;
  professeurs.value = resProfDetails.data;
  filieres.value = resFiliere.data;
  mensuelles.value = resMois.data;

  await nextTick();
  drawCharts();
};

const drawCharts = () => {

  /* ✅ 1️⃣ Heures PAR PROF */
  profChart?.destroy();
  profChart = new Chart(chartProf.value, {
    type: "bar",
    data: {
      labels: statsProf.value.map(s => `${s.nomprof} ${s.prenprof}`),
      datasets: [{
        label: "Heures (Eq.)",
        data: statsProf.value.map(s => s.total_heures),
        backgroundColor: "#4361ee",
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      ...baseOptions,
      scales: {
        x: {
          ticks: {
            font: { family: 'Inter', size: 11 },
            autoSkip: true
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(0,0,0,.05)' }
        }
      }
    }
  });

  /* ✅ 2️⃣ Heures par TYPE (camembert) */
  typeChart?.destroy();
  typeChart = new Chart(chartType.value, {
    type: "pie",
    data: {
      labels: statsType.value.map(s => s.libheure),
      datasets: [{
        data: statsType.value.map(s => s.total_heures),
        backgroundColor: ["#06d6a0", "#f9c74f", "#ef476f"],
        radius: 135,
        hoverRadius: 145,
        offset: 0
      }]
    },
    options: {
      responsive: true,
      animation: false,
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 30,
          right: 30
        }
      },
      plugins: {
        legend: {
          position: "bottom",
          align: "center",
          labels: {
            font: { family: 'Inter', size: 12 },
            boxWidth: 14,
            padding: 16
          }
        },
        tooltip: {
          bodyFont: { family: 'Inter', size: 12 }
        }
      }
    }
  });

  /* ✅ 3️⃣ Heures par DEPARTEMENT */
  depChart?.destroy();
  depChart = new Chart(chartDep.value, {
    type: "bar",
    data: {
      labels: departements.value.map(d => d.departement || 'Non assigné'),
      datasets: [{
        label: "Heures",
        data: departements.value.map(d => d.total_heures),
        backgroundColor: "#17a2b8",
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      ...baseOptions,
      scales: {
        x: {
          ticks: { font: { family: 'Inter', size: 11 }, autoSkip: true },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(0,0,0,.05)' }
        }
      }
    }
  });

  /* ✅ 4️⃣ Heures par FILIERE */
  filiereChart?.destroy();
  filiereChart = new Chart(chartFiliere.value, {
    type: "bar",
    data: {
      labels: filieres.value.map(f => f.filiere || 'Non assigné'),
      datasets: [{
        label: "Heures",
        data: filieres.value.map(f => f.total_heures),
        backgroundColor: "#f9c74f",
        borderRadius: 6,
      }]
    },
    options: {
      ...baseOptions,
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.05)' } }
      }
    }
  });

  /* ✅ 5️⃣ Heures par MOIS */
  moisChart?.destroy();
  moisChart = new Chart(chartMois.value, {
    type: "line",
    data: {
      labels: mensuelles.value.map(m => m.mois),
      datasets: [{
        label: "Heures",
        data: mensuelles.value.map(m => m.total_heures),
        borderColor: "#343a40",
        backgroundColor: "rgba(52,58,64,0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      ...baseOptions,
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.05)' } }
      }
    }
  });

};

onMounted(loadCharts);
</script>
<style scoped>
.page-header h2 {
  font-size: 1.4rem;
  margin-bottom: 2px;
}
.page-header p {
  font-size: 0.82rem;
}

.chart-wrapper {
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* Bar charts */
.chart-bar {
  height: 220px;
}

/* Pie chart */
.chart-pie {
  height: 320px;
}

.chart-pie canvas {
  margin: 0 auto;
}

canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
</style>