<template>
  <div class="container-fluid mt-4">
    <h2>Paramétrage des Équivalences Horaires</h2>
    <p class="text-muted">Définissez ici les coefficients d'équivalence pour chaque type d'heure.</p>
    
    <div class="card col-md-6 mt-4">
      <div class="card-header bg-primary text-white">
        Coefficients par Type d'Heure
      </div>
      <div class="card-body">
        <form @submit.prevent="saveParametrage">
          <table class="table">
            <thead>
              <tr>
                <th>Type d'Heure</th>
                <th>Coefficient (ex: 1.5)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="param in parametrages" :key="param.type_heure">
                <td class="align-middle fw-bold">{{ param.type_heure }}</td>
                <td>
                  <input type="number" step="0.01" class="form-control" v-model="param.coefficient" required />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit" class="btn btn-success" :disabled="loading">
            {{ loading ? 'Sauvegarde...' : 'Enregistrer les modifications' }}
          </button>
          
          <div v-if="message" class="alert mt-3" :class="isSuccess ? 'alert-success' : 'alert-danger'">
            {{ message }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";

const parametrages = ref([]);
const loading = ref(false);
const message = ref("");
const isSuccess = ref(true);

const loadParams = async () => {
  try {
    const res = await api.get("/parametrage");
    parametrages.value = res.data;
  } catch (error) {
    console.error("Erreur lors du chargement des paramétrages", error);
  }
};

const saveParametrage = async () => {
  loading.value = true;
  message.value = "";
  let hasError = false;

  for (const param of parametrages.value) {
    try {
      await api.put("/parametrage", {
        type_heure: param.type_heure,
        coefficient: Number(param.coefficient)
      });
    } catch (error) {
      console.error(error);
      hasError = true;
    }
  }

  if (hasError) {
    isSuccess.value = false;
    message.value = "Erreur lors de la sauvegarde d'un ou plusieurs coefficients.";
  } else {
    isSuccess.value = true;
    message.value = "Coefficients sauvegardés avec succès !";
  }
  loading.value = false;
};

onMounted(loadParams);
</script>
