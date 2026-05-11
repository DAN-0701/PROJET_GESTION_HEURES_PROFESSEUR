<template>
  <div class="container-fluid">

    <div class="page-header mb-4">
      <h2><i class="bi bi-speedometer2 me-2"></i>Tableau de bord Enseignant</h2>
      <p class="text-muted mb-0">Vos heures et rémunération</p>
    </div>

    <div class="row g-3 mb-4">

      <div class="col-md-6">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon" style="background:rgba(67,97,238,.12); color:#4361ee">
              <i class="bi bi-clock-history"></i>
            </div>
            <h6>Total des heures effectuées</h6>
            <div class="kpi-value text-primary">{{ totalHeures }} h</div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon" style="background:rgba(6,214,160,.12); color:#06d6a0">
              <i class="bi bi-cash-coin"></i>
            </div>
            <h6>Montant estimé à percevoir</h6>
            <div class="kpi-value" style="color:#06d6a0">
              {{ montantTotal.toLocaleString() }} FCFA
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="row g-3">
      <div class="col-md-4">
        <div class="card type-card">
          <div class="card-body text-center">
            <div class="type-icon" style="background:linear-gradient(135deg, #4cc9f0, #3a9fd8)">
              <i class="bi bi-journal-text"></i>
            </div>
            <h6 class="mt-3 text-muted">CM</h6>
            <h2 class="fw-bold" style="color:#3a9fd8">{{ heuresParType.CM }} h</h2>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card type-card">
          <div class="card-body text-center">
            <div class="type-icon" style="background:linear-gradient(135deg, #f9c74f, #f4a623)">
              <i class="bi bi-pencil-square"></i>
            </div>
            <h6 class="mt-3 text-muted">TD</h6>
            <h2 class="fw-bold" style="color:#f4a623">{{ heuresParType.TD }} h</h2>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card type-card">
          <div class="card-body text-center">
            <div class="type-icon" style="background:linear-gradient(135deg, #ef476f, #d63050)">
              <i class="bi bi-pc-display"></i>
            </div>
            <h6 class="mt-3 text-muted">TP</h6>
            <h2 class="fw-bold" style="color:#d63050">{{ heuresParType.TP }} h</h2>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";

/* ✅ VARIABLES RÉACTIVES (OBLIGATOIREMENT INITIALISÉES) */
const totalHeures = ref(0);
const montantTotal = ref(0);
const heuresParType = ref({
  CM: 0,
  TD: 0,
  TP: 0
});

/* Heures récupérées */
const heures = ref([]);

/* ⚠️ À ADAPTER À TA SESSION */
const user = JSON.parse(localStorage.getItem("user"));
const matprof = user?.matprof;

/* Taux estimé */
const TAUX_HORAIRE = 1000;

const loadDashboard = async () => {
  try {
    const res = await api.get("/prof/statistiques");

    totalHeures.value = res.data.total ?? 0;
    montantTotal.value = res.data.montant_total ?? 0;
    heuresParType.value = {
      CM: res.data.cm ?? 0,
      TD: res.data.td ?? 0,
      TP: res.data.tp ?? 0
    };
  } catch (err) {
    console.error("❌ Erreur chargement dashboard prof:", err);
  }
};

const calculStats = () => {
  totalHeures.value = 0;
  montantTotal.value = 0;
  heuresParType.value = { CM: 0, TD: 0, TP: 0 };

  heures.value.forEach(h => {
    totalHeures.value += h.nbheure;
    heuresParType.value[h.libheure] += h.nbheure;
    montantTotal.value += h.nbheure * TAUX_HORAIRE;
  });
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

.type-card {
  border: none;
  border-radius: 16px !important;
}

.type-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #fff;
}
</style>