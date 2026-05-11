<template>
  <div>
    <h1 class="mb-4">Heures en dépassement</h1>

    <div class="card">
      <div class="card-header bg-danger text-white">
        Professeurs en dépassement horaire
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Professeur</th>
              <th>Matière</th>
              <th>Volume prévu (h)</th>
              <th>Heures réalisées (h)</th>
              <th>Dépassement (h)</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="depassements.length === 0">
              <td colspan="5" class="text-center text-muted">
                Aucun dépassement enregistré
              </td>
            </tr>

            <tr
              v-for="d in depassements"
              :key="`${d.matprof}-${d.idmat}`"
            >
              <td>{{ d.nomprof }} {{ d.prenprof }}</td>
              <td>{{ d.libmat }}</td>
              <td>{{ d.volume_prevu }}</td>
              <td>{{ d.heures_realisees }}</td>
              <td>
                <span class="badge bg-danger">
                  +{{ d.depassement }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";

const depassements = ref([]);

const loadDepassements = async () => {
  try {
    depassements.value = (await api.get("/heures/depassement")).data;
  } catch (err) {
    console.error("Erreur chargement dépassements", err);
  }
};

onMounted(loadDepassements);
</script>

<style scoped>
h1 {
  color: #dc3545;
  font-weight: 700;
}
</style>