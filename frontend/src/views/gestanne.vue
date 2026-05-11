<template>
  <div>
    <h1>Paramétrage de l’Année Académique</h1>

    <!-- CARTES -->
    <div class="row">
      <!-- Création -->
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3>Création</h3>
            <p>Créer une nouvelle année académique.</p>
            <button class="btn btn-primary w-100"
              @click="activeForm = activeForm === 'create' ? null : 'create'">
              Créer
            </button>
          </div>
        </div>
      </div>

      <!-- Liste -->
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3>Liste</h3>
            <p>Voir toutes les années académiques.</p>
            <button class="btn btn-secondary w-100"
              @click="activeForm = activeForm === 'list' ? null : 'list'">
              Afficher
            </button>
          </div>
        </div>
      </div>

      <!-- Suppression -->
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3>Suppression</h3>
            <p>Supprimer une année académique.</p>
            <button class="btn btn-danger w-100"
              @click="activeForm = activeForm === 'del' ? null : 'del'">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MESSAGE -->
    <div v-if="message"
      :class="[
        'alert d-flex justify-content-between align-items-center mt-4',
        isSuccess ? 'alert-success' : 'alert-danger'
      ]">
      <span>{{ message }}</span>
      <button class="btn-close" @click="message = ''"></button>
    </div>

    <!-- ================= CREATION ================= -->
    <Transition name="fcreate">
      <div v-if="activeForm === 'create'"
        class="card border border-secondary bg-light mt-5">

        <div class="card-header bg-primary text-white">
          Création d’une Année Académique
        </div>

        <div class="card-body">
          <form @submit.prevent="createAnnee">

            <div class="mb-3">
              <label class="form-label">Libellé</label>
              <input class="form-control"
                placeholder="Ex : 2024-2025"
                v-model="libeanne"
                required />
            </div>

            <div class="mb-3">
              <label class="form-label">Date de début</label>
              <input type="date"
                class="form-control"
                v-model="date_debut"
                required />
            </div>

            <div class="mb-3">
              <label class="form-label">Date de fin</label>
              <input type="date"
                class="form-control"
                v-model="date_fin"
                required />
            </div>

            <div class="d-flex justify-content-between">
              <button type="reset"
                class="btn btn-outline-secondary w-50 me-2">
                Reset
              </button>
              <button class="btn btn-primary w-50">
                Créer l’année
              </button>
            </div>

          </form>
        </div>
      </div>
    </Transition>

    <!-- ================= LISTE ================= -->
    <Transition name="fcreate">
      <div v-if="activeForm === 'list'"
        class="card border border-secondary bg-light mt-5">

        <div class="card-header bg-secondary text-white">
          Liste des Années Académiques
        </div>

        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Libellé</th>
                <th>Date début</th>
                <th>Date fin</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in annees" :key="a.idanne">
                <td>{{ a.libeanne }}</td>
                <td>{{ formatDate(a.date_debut) }}</td>
                <td>{{ formatDate(a.date_fin) }}</td>
                <td>
                  <span v-if="isActive(a)" class="badge bg-success">
                    Active
                  </span>
                  <span v-else class="badge bg-secondary">
                    Inactive
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Transition>

    <!-- ================= SUPPRESSION ================= -->
    <Transition name="fcreate">
      <div v-if="activeForm === 'del'"
        class="card border border-secondary bg-light mt-5">

        <div class="card-header bg-danger text-white">
          Suppression d’une Année Académique
        </div>

        <div class="card-body">
          <p class="text-danger fw-bold">
            ⚠️ Cette action est irréversible !
          </p>

          <select class="form-select mb-3" v-model="selectedAnnee">
            <option disabled value="">Sélectionnez une année</option>
            <option v-for="a in annees" :key="a.idanne" :value="a">
              {{ a.libeanne }}
            </option>
          </select>

          <p v-if="selectedAnnee">
            Vous êtes sur le point de supprimer définitivement l’année
            <strong>{{ selectedAnnee.libeanne }}</strong>.
          </p>

          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-outline-secondary w-50 me-2"
              @click="cancelDelete">
              Annuler
            </button>

            <button class="btn btn-danger w-50"
              :disabled="!selectedAnnee"
              @click="deleteAnnee">
              Supprimer définitivement
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";

const activeForm = ref(null);
const message = ref("");
const isSuccess = ref(null);

const libeanne = ref("");
const date_debut = ref("");
const date_fin = ref("");

const annees = ref([]);
const selectedAnnee = ref(null);

/* Charger les années */
const loadAnnees = async () => {
  const res = await api.get("/annees");
  annees.value = res.data;
};
onMounted(loadAnnees);

/* Vérifier si une année est active */
const isActive = (a) => {
  const today = new Date();
  return today >= new Date(a.date_debut) && today <= new Date(a.date_fin);
};

/* Format date */
const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR");

/* Création */
const createAnnee = async () => {
  try {
    const res = await api.post("/annees", {
      libeanne: libeanne.value,
      date_debut: date_debut.value,
      date_fin: date_fin.value
    });
    message.value = res.data.message;
    isSuccess.value = true;
    libeanne.value = "";
    date_debut.value = "";
    date_fin.value = "";
    loadAnnees();
  } catch {
    message.value = "Erreur serveur";
    isSuccess.value = false;
  }
};

/* Suppression */
const deleteAnnee = async () => {
  if (!selectedAnnee.value) return;

  try {
    const res = await api.delete(`/annees/${selectedAnnee.value.idanne}`);
    message.value = res.data.message;
    isSuccess.value = true;
    selectedAnnee.value = null;
    loadAnnees();
  } catch {
    message.value = "Erreur de suppression";
    isSuccess.value = false;
  }
};

/* Annuler suppression */
const cancelDelete = () => {
  selectedAnnee.value = null;
  message.value = "";
};
</script>

<style scoped>
.fcreate-enter-active, .fcreate-leave-active {
  transition: all 0.5s ease;
}
.fcreate-enter-from, .fcreate-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.fcreate-enter-to, .fcreate-leave-from {
  opacity: 1;
  transform: translateY(0);
}
h1 {
  color: #0d6efd;
  font-weight: bold;
}
.card {
  min-height: 250px;
}
</style>