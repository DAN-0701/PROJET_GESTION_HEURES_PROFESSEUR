<template>
  <div>
    <h1>Gestion des Matières</h1>

    <!-- CARTES -->
    <div class="row">
      <!-- Création -->
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3>Création</h3>
            <p>Ajouter une nouvelle matière.</p>
            <button class="btn btn-primary w-100"
                    @click="activeForm = activeForm === 'create' ? null : 'create'">
              Créer
            </button>
          </div>
        </div>
      </div>

      <!-- Modification -->
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3>Modification</h3>
            <p>Modifier une matière existante.</p>
            <button class="btn btn-warning w-100"
                    @click="activeForm = activeForm === 'mod' ? null : 'mod'">
              Modifier
            </button>
          </div>
        </div>
      </div>

      <!-- Suppression -->
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3>Suppression</h3>
            <p>Supprimer une matière.</p>
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
           class="card border border-1 border-secondary shadow-sm bg-light mt-5">

        <div class="card-header bg-primary text-white">
          <h4>Création d’une Matière</h4>
        </div>

        <div class="card-body">
          <form @submit.prevent="createMat">

            <div class="row mb-4">
              <div class="col">
                <label class="form-label">Libellé</label>
                <input class="form-control"
                       v-model="libmat"
                       placeholder="Ex: Mathématiques"
                       required />
              </div>

              <div class="col">
                <label class="form-label">Volume horaire (heures)</label>
                <input type="number"
                       class="form-control"
                       v-model="volmat"
                       min="1"
                       placeholder="Ex: 60"
                       required />
              </div>
            </div>

            <button class="btn btn-primary w-100">
              Créer
            </button>
          </form>
        </div>
      </div>
    </Transition>


    <Transition name="fcreate">
       <div v-if="activeForm === null" class="mt-5">
        <h3 class="mb-3">Liste des matières</h3>

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
                    <th>Volume horaire</th>
                    <th class="text-center">Action</th>
                  </tr>
                </thead>
                
              <tbody>
                <!-- Aucun résultat -->
                <tr v-if="matieres.length === 0">
                  <td colspan="3" class="text-center text-muted">
                    Aucune matière trouvée
                  </td>
                </tr>

                <!-- Lignes -->
                <tr
                  v-for="matiere in matieres"
                  :key="matiere.idmat"
                >
                  <td>{{ matiere.idmat }}</td>
                  <td>{{ matiere.libmat }}</td>
                  <td>
                    <span class="badge bg-primary">
                      {{ matiere.volmat }} h
                    </span>
                  </td>
                  
                  <td class="text-center">
                      <button class="btn btn-sm btn-warning"
                      @click="selectMatiere(matiere)"
                    >
                    Modifier
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
       </div>
    </Transition>
    <!-- ================= MODIFICATION ================= -->
    <Transition name="fcreate">
      <div v-if="activeForm === 'mod'"
           class="card border border-1 border-secondary shadow-sm bg-light mt-5">

        <div class="p-3 position-relative">
          <input type="search"
                 class="form-control"
                 placeholder="Rechercher une matière..."
                 v-model="searchQuery" />

          <ul v-if="suggestions.length"
              class="list-group position-absolute w-100 mt-1 shadow-sm">
            <li v-for="m in suggestions"
                :key="m.idmat"
                class="list-group-item list-group-item-action"
                @click="selectMat(m)">
              {{ m.libmat }} — {{ m.volmat }} h
            </li>
          </ul>
        </div>

        <div class="card-header bg-warning">
          <h4>Modification de la Matière</h4>
        </div>

        <div class="card-body">
          <form @submit.prevent="updateMat">
            <label for="email" class="form-label">NOM DE LA MATIERE</label>
            <input class="form-control mb-3" v-model="libmat" required />
            <label for="email" class="form-label">Volume horaire (heures)</label>
            <input type="number" class="form-control mb-3" v-model="volmat" required />

            <div class="d-flex justify-content-between">
        <button type="reset" class="btn btn-outline-secondary w-50 me-2" @click="Cancel()">Reset</button>
        <button type="submit" class="btn btn-warning w-50">Modifier</button>
      </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- ================= SUPPRESSION ================= -->
    <Transition name="fcreate">
      <div v-if="activeForm === 'del'"
           class="card border border-1 border-secondary shadow-sm bg-light mt-5">

        <div class="p-3 position-relative">
          <input type="search"
                 class="form-control"
                 placeholder="Rechercher une matière..."
                 v-model="searchQuery" />

          <ul v-if="suggestions.length"
              class="list-group position-absolute w-100 mt-1 shadow-sm">
            <li v-for="m in suggestions"
                :key="m.idmat"
                class="list-group-item list-group-item-action"
                @click="selectMat(m)">
              {{ m.libmat }} — {{ m.volmat }} h
            </li>
          </ul>
        </div>

        <div class="card-header bg-danger text-white">
          <h4>Suppression de la Matière</h4>
        </div>

        <div class="card-body">
          <p v-if="selectedMatId" class="text-danger fw-bold">
            ⚠️ Cette action est irréversible !
          </p>

          <p v-if="selectedMatId">
            Vous êtes sur le point de supprimer définitivement la matière
            <strong>{{ libmat.toUpperCase() }} — {{ volmat }} h</strong>.
          </p>

          <p v-else class="text-muted">
            Aucune matière sélectionnée.
          </p>
          <div class="d-flex justify-content-between">
        <button type="reset" class="btn btn-outline-secondary w-50 me-2" @click="Cancel()">Reset</button>
        <button type="submit" class="btn btn-danger w-50" @click="deleteMat">Supprimer</button>
      </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { ref, watch} from "vue";
import { onMounted } from "vue";
import api from "../services/api.js";

const activeForm = ref(null);
const message = ref("");
const isSuccess = ref(null);

const libmat = ref("");
const volmat = ref("");

const searchQuery = ref("");
const suggestions = ref([]);
const selectedMatId = ref(null);

const matieres = ref([]);
const loading = ref(false);

//liste


const loadMatieres = async () => {
  loading.value = true;
  try {
    const res = await api.get("/matieres"); // ✅ route backend
    matieres.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Erreur chargement des matières", error);
    matieres.value = [];
  } finally {
    loading.value = false;
  }
};
onMounted(loadMatieres);


const selectMatiere = (matiere) => {
  selectedMatId.value = matiere.idmat;
  libmat.value = matiere.libmat;
  volmat.value = matiere.volmat;
  activeForm.value = "mod";
};

/* SEARCH */
watch(searchQuery, async (val) => {
  if (val.length >= 2) {
    const res = await api.get(`/matieres/search?q=${val}`);
    suggestions.value = res.data;
  } else {
    suggestions.value = [];
  }
});

/* SELECT */
const selectMat = (m) => {
  selectedMatId.value = m.idmat;
  libmat.value = m.libmat;
  volmat.value = m.volmat;
  suggestions.value = [];
  searchQuery.value = "";
};

/* CREATE */
const createMat = async () => {
  const res = await api.post("/matieres", {
    libmat: libmat.value,
    volmat: volmat.value
  });
  message.value = res.data.message;
  isSuccess.value = true;
  resetForm();
};

/* UPDATE */
const updateMat = async () => {
  const res = await api.put(`/matieres/${selectedMatId.value}`, {
    libmat: libmat.value,
    volmat: volmat.value
  });
  message.value = res.data.message;
  isSuccess.value = true;
  resetForm();
};
const Cancel = () => {
  resetForm();          
  message.value = "";   
};
/* DELETE */
const deleteMat = async () => {
  const res = await api.delete(`/matieres/${selectedMatId.value}`);
  message.value = res.data.message;
  isSuccess.value = true;
  resetForm();
};

const resetForm = () => {
  libmat.value = "";
  volmat.value = "";
  searchQuery.value = "";
  suggestions.value = [];
  selectedMatId.value = null;
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
