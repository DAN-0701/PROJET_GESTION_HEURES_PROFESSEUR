<template>
  <div class="container-fluid">

    <div class="page-header mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h2><i class="bi bi-speedometer2 me-2"></i>Tableau de bord Administrateur</h2>
        <p class="text-muted mb-0">Vue d'ensemble de la plateforme</p>
      </div>
      <div>
        <button class="btn btn-primary" @click="sauvegarderBD" :disabled="backupLoading">
          <i class="bi bi-database-down me-1"></i> {{ backupLoading ? 'Sauvegarde...' : 'Sauvegarder BD' }}
        </button>
      </div>
    </div>

    <!-- ✅ KPI PRINCIPAUX -->
    <div class="row g-3 mb-4">

      <div class="col-md-3">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon" style="background:rgba(67,97,238,.12); color:#4361ee">
              <i class="bi bi-people-fill"></i>
            </div>
            <h6>Total enseignants</h6>
            <div class="kpi-value text-primary">{{ totalEnseignants }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon" style="background:rgba(6,214,160,.12); color:#06d6a0">
              <i class="bi bi-building"></i>
            </div>
            <h6>Départements</h6>
            <div class="kpi-value" style="color:#06d6a0">{{ totalDepartements }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon" style="background:rgba(239,71,111,.12); color:#ef476f">
              <i class="bi bi-person-x-fill"></i>
            </div>
            <h6>Profs non affectés</h6>
            <div class="kpi-value text-danger">{{ profsNonAffectes }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon" style="background:rgba(249,199,79,.12); color:#f9c74f">
              <i class="bi bi-calendar-event-fill"></i>
            </div>
            <h6>Année en cours</h6>
            <div class="kpi-value" style="color:#f4a623; font-size:1.2rem">
              {{ anneeActive ? anneeActive.libeanne : "Aucune" }}
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ✅ RÉPARTITIONS -->
    <div class="row g-4">

      <!-- Répartition par statut -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <i class="bi bi-pie-chart-fill me-2"></i>Répartition par statut
          </div>
          <div class="card-body p-0">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center px-4 py-3">
                <span><i class="bi bi-circle-fill me-2" style="color:#4361ee; font-size:.5rem"></i>Permanent</span>
                <span class="badge bg-primary rounded-pill">{{ statutCount.Permanent }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center px-4 py-3">
                <span><i class="bi bi-circle-fill me-2" style="color:#f9c74f; font-size:.5rem"></i>Vacataire</span>
                <span class="badge bg-warning text-dark rounded-pill">{{ statutCount.Vacataire }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Répartition par grade -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-success text-white">
            <i class="bi bi-bar-chart-fill me-2"></i>Répartition par grade
          </div>
          <div class="card-body p-0">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center px-4 py-3">
                <span><i class="bi bi-circle-fill me-2" style="color:#4cc9f0; font-size:.5rem"></i>Assistant</span>
                <span class="badge bg-info rounded-pill">{{ gradeCount.assistant }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center px-4 py-3">
                <span><i class="bi bi-circle-fill me-2" style="color:#4361ee; font-size:.5rem"></i>Maître Assistant</span>
                <span class="badge bg-primary rounded-pill">{{ gradeCount.maitreAssistant }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center px-4 py-3">
                <span><i class="bi bi-circle-fill me-2" style="color:#06d6a0; font-size:.5rem"></i>Professeur</span>
                <span class="badge bg-success rounded-pill">{{ gradeCount.professeur }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>

    <!-- ✅ LISTE DES PROFS NON AFFECTÉS -->
    <div class="row mt-4" v-if="listeProfsNonAffectes.length > 0">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-danger text-white">
            <i class="bi bi-person-x-fill me-2"></i>Enseignants sans affectation
          </div>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom & Prénom</th>
                  <th>Statut</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in listeProfsNonAffectes" :key="p.matprof">
                  <td>{{ p.matprof }}</td>
                  <td>{{ p.nomprof }} {{ p.prenprof }}</td>
                  <td>{{ p.statut }}</td>
                  <td>{{ p.grade }}</td>
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
import api from "../services/api.js";

const affectations = ref([]);
const profsNonAffectes = ref(0);
const listeProfsNonAffectes = computed(() => {
  const profsAffectesIds = affectations.value.map(a => a.matproff);
  return enseignants.value.filter(p => !profsAffectesIds.includes(p.matprof));
});
const enseignants = ref([]);
const totalEnseignants = ref(0);
const totalDepartements = ref(0);
const anneeActive = ref(null);
const backupLoading = ref(false);

const statutCount = ref({
  Permanent: 0,
  Vacataire: 0
});

const gradeCount = ref({
  assistant: 0,
  maitreAssistant: 0,
  professeur: 0
});

const sauvegarderBD = async () => {
  backupLoading.value = true;
  try {
    const response = await api.get('/admin/backup', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `backup_gestprofesseur_${date}.sql`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Erreur de sauvegarde", error);
    alert("Une erreur est survenue lors de la sauvegarde de la base de données.");
  } finally {
    backupLoading.value = false;
  }
};

/* ✅ AJOUT ROBUSTE */
const getGrade = (p) =>
  p.grade ?? p.gradeprof ?? p.grade_prof ?? "";

const normalize = (val) =>
  val?.toString().trim().toLowerCase();

/* CHARGEMENT DES DONNÉES */
const loadDashboard = async () => {
  const [profRes, depRes, anneesRes, affectRes] = await Promise.all([
    api.get("/professeurs"),
    api.get("/departements"),
    api.get("/annees"),
    api.get("/affectations")
  ]);

  enseignants.value = profRes.data;
  affectations.value = affectRes.data;
  totalDepartements.value = depRes.data.length;

  const today = new Date();
  anneeActive.value =
    anneesRes.data.find(a =>
      today >= new Date(a.date_debut) &&
      today <= new Date(a.date_fin)
    ) || null;

  computeStats();
};

/* CALCUL DES STATISTIQUES */
const computeStats = () => {
  totalEnseignants.value = enseignants.value.length;

  statutCount.value = {
    Permanent: enseignants.value.filter(p => p.statut === "Permanent").length,
    Vacataire: enseignants.value.filter(p => p.statut === "Vacataire").length
  };

  gradeCount.value = {
    assistant: enseignants.value.filter(
      p => normalize(getGrade(p)) === "assistant"
    ).length,

    maitreAssistant: enseignants.value.filter(
      p => normalize(getGrade(p)) === "maitre assistant"
    ).length,

    professeur: enseignants.value.filter(
      p => normalize(getGrade(p)) === "professeur"
    ).length
  };

  profsNonAffectes.value = listeProfsNonAffectes.value.length;
};

onMounted(loadDashboard);
</script>
<style scoped>
.page-header h2 {
  font-size: 1.4rem;
  margin-bottom: 2px;
}
.page-header p {
  font-size: 0.82rem;
}
</style>
