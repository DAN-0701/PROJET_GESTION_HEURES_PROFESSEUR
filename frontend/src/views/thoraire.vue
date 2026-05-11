<template>
  <div>
    <h1>Gestion des Taux Horaires</h1>

    <!-- CARTES -->
    <div class="row">
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3>Création</h3>
            <p class="card-text">Ajoutez un nouveau taux horaire</p>
            <button class="btn btn-primary w-100"
              @click="activeForm = activeForm === 'create' ? null : 'create'">
              Créer
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3>Modification</h3>
            <p class="card-text">Modifiez un taux horaire existant</p>
            <button class="btn btn-warning w-100"
              @click="activeForm = activeForm === 'mod' ? null : 'mod'">
              Modifier
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3>Suppression</h3>
            <p class="card-text">Supprimez un taux horaire existant</p>
            <button class="btn btn-danger w-100"
              @click="activeForm = activeForm === 'del' ? null : 'del'">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MESSAGE -->
    <div
  v-if="message"
  :class="[
    'alert d-flex justify-content-between align-items-center mt-4',
    isSuccess ? 'alert-success' : 'alert-danger'
  ]"
>
  <span>{{ message }}</span>
  <button type="button" class="btn-close" @click="message = ''"></button>
</div>
    <!-- ================= CREATION ================= -->
    <Transition name="fcreate">
      <div v-if="activeForm === 'create'"
           class="card border border-secondary bg-light mt-5">

        <div class="card-header bg-primary text-white">
          Création du Taux Horaire
        </div>

        <div class="card-body">
          <form @submit.prevent="createTh">

            <div class="mb-3">
              <label class="form-label">Grade</label>
              <select class="form-select" v-model="libth" required>
                <option value="">Sélectionnez...</option>
                <option value="assistant">Assistant</option>
                <option value="maitre assistant">Maître assistant</option>
                <option value="professeur">Professeur</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Montant horaire (FCFA)</label>
              <input type="number" class="form-control"
                     v-model.number="montantth" required />
            </div>

            <button class="btn btn-primary w-100">
              Créer
            </button>
          </form>
        </div>
      </div>
    </Transition>
    <!--liste-->
    <transition name="fcreate">
      <div v-if="activeForm === null" class="mt-5">
        
 <h3 class="mb-3">Liste des taux horaires</h3>

    <!-- Chargement -->
    <div v-if="loading" class="text-muted">
      Chargement...
    </div>

    <!-- Tableau -->
    <div v-else class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Libellé</th>
            <th>Montant</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        
      <tbody>
          <!-- Aucun résultat -->
          <tr v-if="tauxHoraires.length === 0">
            <td colspan="4" class="text-center text-muted">
              Aucun taux horaire trouvé
            </td>
          </tr>

          <!-- Lignes -->
          <tr v-for="th in tauxHoraires" :key="th.idth">
            <td>{{ th.idth }}</td>
            <td>{{ th.libth }}</td>
            <td>
              <span class="badge bg-primary">
                {{ th.montantth }} FCFA
              </span>
            </td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-warning"
                @click="selectTauxHoraire(th)"
              >
                Modifier
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

      </div>
    </transition>
    <!-- ================= MODIFICATION ================= -->
    <Transition name="fcreate">
      <div v-if="activeForm === 'mod'"
           class="card border border-secondary bg-light mt-5">
        <div class="card-header bg-warning text-white">
          <h4 class="mb-0" style="color: black;">Formulaire de Modification du Professeur</h4>
        </div>

        <div class="p-3 position-relative">
          <input type="search" class="form-control"
                 placeholder="Rechercher un grade..."
                 v-model="searchQuery" />

          <ul v-if="suggestions.length"
              class="list-group position-absolute w-100">
            <li v-for="t in suggestions"
                :key="t.idth"
                class="list-group-item list-group-item-action"
                @click="selectTh(t)">
              {{ t.libth }} — {{ t.montantth }} FCFA
            </li>
          </ul>
        </div>

        <div class="card-body">
          <form @submit.prevent="updateTh">
            <label for="grade" class="form-label">Grade</label>
            <select class="form-select mb-3" id="grade" v-model="libth" required>
              <option value="">Sélectionnez...</option>
              <option value="assistant">Assistant</option>
              <option value="maitre assistant">Maître assistant</option>
              <option value="professeur">Professeur</option>
            </select>

            <label for="montant" class="form-label">Montant horaire (FCFA)</label>
            <input type="number" class="form-control mb-3"
                   id="montant"
                   v-model.number="montantth" required />

            <div class="d-flex justify-content-between">
              <button type="reset"
                      class="btn btn-outline-secondary w-50 me-2" @click="cancelDelete()">
                Reset
              </button>
              <button type="submit"
                      class="btn btn-warning w-50" @click="updateTh">
                Modifier
                
              </button>
              </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- ================= SUPPRESSION ================= -->
<Transition name="fcreate">
  <div
    v-if="activeForm === 'del'"
    class="card border border-1 border-secondary shadow-sm bg-light mt-5"
  >

    <!-- Recherche -->
    <div class="p-3 position-relative">
      <input
        type="search"
        class="form-control"
        placeholder="Rechercher un grade..."
        v-model="searchQuery"
      />

      <ul v-if="suggestions.length"
          class="list-group position-absolute w-100 mt-1 shadow-sm">
        <li
          v-for="t in suggestions"
          :key="t.idth"
          class="list-group-item list-group-item-action"
          @click="selectTh(t)"
        >
          {{ t.libth }} — {{ t.montantth }} FCFA
        </li>
      </ul>
    </div>

    <!-- Header -->
    <div class="card-header bg-danger text-white">
      <h4 class="mb-0">Suppression du Taux Horaire</h4>
    </div>

    <!-- Corps -->
    <div class="card-body">
      <!-- ✅ ROLE / GRADE -->
      <div class="mb-3">
        <label class="form-label">Rôle / Grade</label>
        <input
          type="text"
          class="form-control"
          :value="libth"
          disabled
        />
      </div>

      <!-- ✅ MONTANT -->
      <div class="mb-3">
        <label class="form-label">Montant horaire (FCFA)</label>
        <input
          type="number"
          class="form-control"
          :value="montantth"
          disabled
        />
      </div>

      <p class="text-danger fw-bold">
        ⚠️ Cette action est irréversible !
      </p>

      <div class="d-flex justify-content-between">
              <button type="reset"
                      class="btn btn-outline-secondary w-50 me-2" @click="cancelDelete()">
                Reset
              </button>
              <button type="submit"
                      class="btn btn-warning w-50" @click="deleteTh">
                Supprimer définitivement
                
              </button>
    </div></div>
  </div>
</Transition>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { onMounted } from "vue";
import api from "../services/api.js";

const activeForm = ref(null);
const message = ref("");
const isSuccess = ref(null);

const libth = ref("");
const montantth = ref("");

const searchQuery = ref("");
const suggestions = ref([]);
const selectedThId = ref(null);


const tauxHoraires = ref([]);
const loading = ref(false);

// sélection pour modification
const selectedTauxHoraireId = ref(null);


const loadTauxHoraires = async () => {
  loading.value = true;
  try {
    const res = await api.get("/thoraire"); // ✅ backend
    tauxHoraires.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Erreur chargement des taux horaires", error);
    tauxHoraires.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadTauxHoraires);

const selectTauxHoraire = (th) => {
  selectedTauxHoraireId.value = th.idth;
  libth.value = th.libth;
  montantth.value = th.montantth;
  activeForm.value = "mod";
};

/* SEARCH */
watch(searchQuery, async (val) => {
  if (val.length >= 1) {
    const res = await api.get(`/thoraire/search?q=${val}`);
    suggestions.value = res.data;
  } else {
    suggestions.value = [];
  }
});

/* SELECT */
const selectTh = (t) => {
  selectedThId.value = t.idth;
  libth.value = t.libth;
  montantth.value = t.montantth;

  
  suggestions.value = [];
  searchQuery.value = ""

};

/* CREATE */
const createTh = async () => {
  const res = await api.post("/thoraire", {
    libth: libth.value,
    montantth: montantth.value
  });
  message.value = res.data.message;
  isSuccess.value = true;
};

/* UPDATE */
const updateTh = async () => {
  const res = await api.put(`/thoraire/${selectedThId.value}`, {
    libth: libth.value,
    montantth: montantth.value
  });
  message.value = res.data.message;
  isSuccess.value = true;
};
const cancelDelete = () => {
  searchQuery.value = "";
  suggestions.value = []
  montantth.value = "";        
  message.value = ""; 
  libth.value = "";
  
};

/* DELETE */
const deleteTh = async () => {
  const res = await api.delete(`/thoraire/${selectedThId.value}`);
  message.value = res.data.message;
  isSuccess.value = true;
};
</script>
<style scoped>
.fcreate-enter-active, .fcreate-leave-active {
  transition: all 0.5s ease;
}

/* apparition */
.fcreate-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fcreate-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* disparition */
.fcreate-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fcreate-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

h1 {
  color: #0d6efd;
  font-weight: bold;
}
.card {
  min-height: 250px;
}
.label-left {
  display: block;
  text-align: left;
  margin-bottom: 0.3rem;
  font-weight: 500;
}
</style>