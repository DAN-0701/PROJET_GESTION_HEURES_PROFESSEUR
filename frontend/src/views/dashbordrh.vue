<template>
  <div class="container-fluid">

    <div class="page-header mb-4">
      <h2><i class="bi bi-speedometer2 me-2"></i>Tableau de bord RH</h2>
      <p class="text-muted mb-0">Indicateurs clés de gestion des heures</p>
    </div>

    <div class="row g-3 mb-4">

      <div class="col-md-3">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon" style="background:rgba(67,97,238,.12); color:#4361ee">
              <i class="bi bi-clock-history"></i>
            </div>
            <h6>Heures totales saisies</h6>
            <div class="kpi-value text-primary">{{ totalHeures }} h</div>
            <small class="text-muted">{{ mois }}/{{ annee }}</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon" style="background:rgba(6,214,160,.12); color:#06d6a0">
              <i class="bi bi-check-circle-fill"></i>
            </div>
            <h6>Heures validées</h6>
            <div class="kpi-value" style="color:#06d6a0">{{ heuresValidees }} h</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon" style="background:rgba(249,199,79,.12); color:#f9c74f">
              <i class="bi bi-exclamation-triangle-fill"></i>
            </div>
            <h6>Enseignants en dépassement</h6>
            <div class="kpi-value" style="color:#f4a623">{{ enseignantsDepassement }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon" style="background:rgba(76,201,240,.12); color:#4cc9f0">
              <i class="bi bi-hourglass-split"></i>
            </div>
            <h6>Heures non validées</h6>
            <div class="kpi-value" style="color:#4cc9f0">{{ heuresNonValidees }} h</div>
          </div>
        </div>
      </div>

    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="d-flex align-items-center gap-3">
              <div class="kpi-icon" style="background:rgba(6,214,160,.12); color:#06d6a0; flex-shrink:0">
                <i class="bi bi-cash-coin"></i>
              </div>
              <div>
                <h6 class="mb-1">Montant total à payer</h6>
                <div class="kpi-value" style="color:#06d6a0">
                  {{ montantTotal.toLocaleString() }} FCFA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";

/* FILTRES */
const mois = ref(new Date().getMonth() + 1);
const annee = ref(new Date().getFullYear());

/* DONNÉES */
const heures = ref([]);

/* KPI */
const totalHeures = ref(0);
const heuresValidees = ref(0);
const heuresNonValidees = ref(0);
const enseignantsDepassement = ref(0);
const heuresComplementaires = ref(0);
const montantTotal = ref(0);

/* CONSTANTES MÉTIER */
const HEURES_NORMALES = 160;

/* CHARGEMENT */
const loadDashboardRH = async () => {
  try {
    const res = await api.get("/dashbord");

    heuresValidees.value = res.data.heures_validees ?? 0;
    heuresNonValidees.value = res.data.heures_non_validees ?? 0;
    montantTotal.value = res.data.montant_total ?? 0;
    enseignantsDepassement.value = res.data.enseignants_depassement ?? 0;

    // Dérivés simples
    totalHeures.value = heuresValidees.value + heuresNonValidees.value;

  } catch (err) {
    console.error("❌ Erreur dashboard RH :", err);
  }
};

/* CALCUL DES INDICATEURS */
const calculStats = () => {
  const heuresFiltrees = heures.value.filter(h => {
    const d = new Date(h.datecours);
    return (
      d.getMonth() + 1 === mois.value &&
      d.getFullYear() === annee.value
    );
  });

  totalHeures.value = heuresFiltrees.reduce(
    (s, h) => s + h.nbheure, 0
  );

  heuresValidees.value = heuresFiltrees
    .filter(h => h.statut === "valide")
    .reduce((s, h) => s + h.nbheure, 0);

  heuresNonValidees.value =
    totalHeures.value - heuresValidees.value;

  const heuresParProf = {};
  heuresFiltrees.forEach(h => {
    const key = `${h.nomprof} ${h.prenprof}`;
    heuresParProf[key] =
      (heuresParProf[key] || 0) + h.nbheure;
  });

  enseignantsDepassement.value = 0;
  heuresComplementaires.value = 0;

  Object.values(heuresParProf).forEach(nb => {
    if (nb > HEURES_NORMALES) {
      enseignantsDepassement.value++;
      heuresComplementaires.value += (nb - HEURES_NORMALES);
    }
  });

  montantTotal.value = heuresValidees.value * 1000;
};

onMounted(loadDashboardRH);
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