<template>
  <div>
    <div>
    <h1>Gestion des Professeurs</h1>
    <p>Bienvenue dans la section de gestion des Professeurs</p>
  </div>
    <!-- CARTES -->
    <div class="row">
      <!-- Création -->
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3>Création</h3>
            <p>Ajoutez un nouveau professeur.</p>
            <button
              class="btn btn-primary w-100"
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
            <p>Modifier un professeur existant.</p>
            <button
              class="btn btn-warning w-100"
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
            <p>Supprimer un professeur.</p>
            <button
              class="btn btn-danger w-100"
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
      :class="['alert d-flex justify-content-between align-items-center mt-4',
               isSuccess ? 'alert-success' : 'alert-danger']">
      <span>{{ message }}</span>
      <button type="button" class="btn-close" @click="message = ''"></button>
    </div>

    <!-- ================= CRÉATION ================= -->
<Transition name="fcreate">
  <div
    v-if="activeForm === 'create'"
    class="card border border-1 border-secondary shadow-sm bg-light mt-5 custom-shadow"
    mode="in-out">

    <!-- En-tête -->
    <div class="card-header bg-primary text-white">
      <h4 class="mb-0">Formulaire de Création du Professeur</h4>
    </div>

    <!-- Corps -->
    <div class="card-body">
      <form @submit.prevent="createProf">

        <!-- Nom / Prénom -->
        <div class="row mb-4">
          <div class="col">
            <label class="form-label">Nom</label>
            <input
              type="text"
              class="form-control"
              placeholder="Nom du professeur"
              required
              v-model="nom"
            />
          </div>

          <div class="col">
            <label class="form-label">Prénom</label>
            <input
              type="text"
              class="form-control"
              placeholder="Prénom du professeur"
              required
              v-model="prenom"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="row mb-4">
          <div class="col">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              placeholder="Adresse email"
              required
              v-model="email"
            />
          </div>
        </div>

        <!-- Grade / Statut -->
        <div class="row mb-4">
          <div class="col">
            <label class="form-label">Grade</label>
            <select class="form-select" v-model="grade" required>
              <option value="">Sélectionnez...</option>
              <option value="assistant">Assistant</option>
              <option value="maitre assistant">Maître assistant</option>
              <option value="professeur">Professeur</option>
            </select>
          </div>

          <div class="col">
            <label class="form-label">Statut</label>
            <select class="form-select" v-model="statut" required>
              <option value="">Sélectionnez...</option>
              <option value="Permanent">Permanent</option>
              <option value="Vacataire">Vacataire</option>
            </select>
          </div>
        </div>

        <div class="row mb-4" v-if="statut === 'Permanent'">
          <div class="col-md-6">
            <label class="form-label">Volume Statutaire (Heures)</label>
            <input
              type="number"
              class="form-control"
              placeholder="Ex: 192"
              v-model="volume_statutaire"
            />
          </div>
        </div>

        <!-- Boutons -->
        <div class="d-flex justify-content-between">
          <button
            type="reset"
            class="btn btn-outline-secondary w-50 me-2"
            @click="resetForm"
          >
            Reset
          </button>

          <button
            type="submit"
            class="btn btn-primary w-50"
          >
            Créer
          </button>
        </div>

      </form>
    </div>
  </div>
</Transition>
    <!-- ================= MODIFICATION ================= -->
    <Transition name="fcreate">
      <div
        v-if="activeForm === 'mod'"
        class="card border border-1 border-secondary shadow-sm bg-light mt-5 custom-shadow"
        mode="in-out">

        <!-- Recherche -->
        <div class="mb-3 position-relative p-3">
          <input
            type="search"
            class="form-control mb-2"
            placeholder="Rechercher un professeur..."
            v-model="searchQuery"
          />

          <ul v-if="suggestions.length"
              class="list-group position-absolute mt-1 shadow-sm"
              style="z-index:1000; left: 1rem; right: 1rem;">
            <li
              v-for="p in suggestions"
              :key="p.iduser"
              class="list-group-item list-group-item-action"
              @click="selectProf(p)">
              {{ p.nomprof }} {{ p.prenprof }}
            </li>
          </ul>
        </div>

        <!-- Header -->
        <div class="card-header bg-warning text-white">
          <h4 class="mb-0" style="color: black;">Formulaire de Modification du Professeur</h4>
        </div>

        <!-- Corps -->
        <div class="card-body">
          <form @submit.prevent="updateProf">

            <div class="row mb-4">
              <div class="col">
                <label class="form-label">Nom</label>
                <input class="form-control" v-model="nom" required />
              </div>
              <div class="col">
                <label class="form-label">Prénom</label>
                <input class="form-control" v-model="prenom" required />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col">
                <label class="form-label">Grade</label>
                <select class="form-select" v-model="grade" required>
                  <option value="assistant">Assistant</option>
                  <option value="maitre assistant">Maître assistant</option>
                  <option value="professeur">Professeur</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Statut</label>
                <select class="form-select" v-model="statut" required>
                  <option value="Permanent">Permanent</option>
                  <option value="Vacataire">Vacataire</option>
                </select>
              </div>
            </div>

            <div class="row mb-4" v-if="statut === 'Permanent'">
              <div class="col-md-6">
                <label class="form-label">Volume Statutaire (Heures)</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="volume_statutaire"
                />
              </div>
            </div>

            <div class="d-flex justify-content-between">
              <button type="reset"
                      class="btn btn-outline-secondary w-50 me-2">
                Reset
              </button>
              <button type="submit"
                      class="btn btn-warning w-50">
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- ================= liste ================= -->
    <Transition name="fcreate">
      <div v-if="activeForm === null" class="mt-5">

        <h3 class="mb-3">Liste des professeurs</h3>

        <div v-if="loading" class="text-muted">
          Chargement...
        </div>
        
<table v-else class="table table-striped table-hover mt-3">
      <thead class="table-dark">
        <tr>
          <th>Matricule</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Grade</th>
          <th>Statut</th>
          <th>Vol. Statutaire</th>
          <th class="text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="professeurs.length === 0">
          <td colspan="5" class="text-center text-muted">
            Aucun professeur trouvé
          </td>
        </tr>
        
<tr v-for="prof in professeurs" :key="prof.matprof" style="cursor: pointer">
          <td>{{ prof.matprof }}</td>
          <td>{{ prof.nomprof }}</td>
          <td>{{ prof.prenprof }}</td>
          <td>{{ prof.grade }}</td>
          <td>
            <span
              class="badge"
              :class="prof.statut === 'Permanent' ? 'bg-success' : 'bg-secondary'"
            >
              {{ prof.statut }}
            </span>
          </td>
          <td>{{ prof.statut === 'Permanent' ? (prof.volume_statutaire || 0) + ' h' : '-' }}</td>
          <td class="text-center">
              <button
                class="btn btn-sm btn-warning"
                @click="selectTauxHoraire(prof)"
              >
                Modifier
              </button>
            </td>
        </tr>
      </tbody>
    </table>
      </div>
    </Transition>

    <!-- ================= SUPPRESSION ================= -->
    <Transition name="fcreate">
      <div
        v-if="activeForm === 'del'"
        class="card border border-1 border-secondary shadow-sm bg-light mt-5 custom-shadow"
        mode="in-out">

        <!-- Recherche -->
        <div class="mb-3 position-relative p-3">
          <input
            type="search"
            class="form-control mb-2"
            placeholder="Rechercher un professeur..."
            v-model="searchQuery"
          />

          <ul v-if="suggestions.length"
              class="list-group position-absolute mt-1 shadow-sm"
              style="z-index:1000; left: 1rem; right: 1rem;">
            <li
              v-for="p in suggestions"
              :key="p.iduser"
              class="list-group-item list-group-item-action"
              @click="selectProf(p)">
              {{ p.nomprof }} {{ p.prenprof }}
            </li>
          </ul>
        </div>

        <!-- Header -->
        <div class="card-header bg-danger text-white">
          <h4 class="mb-0">Formulaire de Suppression du Professeur</h4>
        </div>

        <!-- Corps -->
        <div class="card-body">
          <p class="text-danger fw-bold">
            ⚠️ Cette action est irréversible !
          </p>
          <p>
            Vous êtes sur le point de supprimer définitivement le professeur
            <strong>{{ nom.toUpperCase() }} {{ prenom.toUpperCase() }}</strong>.
          </p>
        </div>

          <div class="d-flex justify-content-between">
            <button
              class="btn btn-outline-secondary w-50 me-2"
              @click="cancelDelete"
            >
              Annuler
            </button>

            <button
              class="btn btn-danger w-50"
              :disabled="!selectedProfId"
              @click="deleteProf"
            >
              Supprimer définitivement
            </button>
          </div>
        </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import api from "../services/api.js";
import { onMounted } from "vue";

const activeForm = ref(null);
const message = ref("");
const isSuccess = ref(null);

const nom = ref("");
const prenom = ref("");
const email = ref("");
const grade = ref("");
const statut = ref("");
const volume_statutaire = ref(0);

const searchQuery = ref("");
const suggestions = ref([]);
const selectedProfId = ref(null);


const professeurs = ref([]);
const loading = ref(false);

const loadProfesseurs = async () => {
  loading.value = true;
  try {
    const res = await api.get("/professeurs"); // route backend
    professeurs.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Erreur chargement des professeurs", error);
    professeurs.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadProfesseurs);
const selectTauxHoraire = (prof) => {
  selectedProfId.value = prof.iduser;
  nom.value = prof.nomprof;
  prenom.value = prof.prenprof;
  email.value = prof.email || "";
  grade.value = prof.grade;
  statut.value = prof.statut;
  volume_statutaire.value = prof.volume_statutaire || 0;
  activeForm.value = "mod";
};

const createProf = async () => {
  try {
    const res = await api.post("/professeurs", {
      nom: nom.value,
      prenom: prenom.value,
      email: email.value,
      grade: grade.value,
      statut: statut.value,
      volume_statutaire: statut.value === 'Permanent' ? volume_statutaire.value : 0
    });

    message.value = res.data.message || "✅ Professeur créé avec succès";
    isSuccess.value = true;
    resetForm();
  } catch (error) {
    message.value =
      error.response?.data?.message ||
      "Erreur lors de la création du professeur";
    isSuccess.value = false;
  }
};

/* Recherche */
watch(searchQuery, async (val) => {
  if (val.length >= 2) {
    const res = await api.get(`/professeurs/search?q=${val}`);
    suggestions.value = res.data;
  } else {
    suggestions.value = [];
  }
});

/* Sélection */
const selectProf = (prof) => {
  selectedProfId.value = prof.iduser;
  nom.value = prof.nomprof;
  prenom.value = prof.prenprof;
  email.value = prof.email || "";
  grade.value = prof.grade;
  statut.value = prof.statut;
  volume_statutaire.value = prof.volume_statutaire || 0;

  message.value = "✅ Professeur sélectionné";
  isSuccess.value = true;
  
  suggestions.value = [];
  searchQuery.value = ""

};

/* Update */
const updateProf = async () => {
  try {
    const res = await api.put(`/professeurs/${selectedProfId.value}`, {
      nom: nom.value,
      prenom: prenom.value,
      email: email.value,
      grade: grade.value,
      statut: statut.value,
      volume_statutaire: statut.value === 'Permanent' ? volume_statutaire.value : 0
    });
    message.value = res.data.message;
    isSuccess.value = true;
    resetForm();
  } catch {
    message.value = "Erreur de mise à jour";
    isSuccess.value = false;
  }
};

/* Delete */
const deleteProf = async () => {
  try {
    const res = await api.delete(`/professeurs/${selectedProfId.value}`);
    message.value = res.data.message;
    isSuccess.value = true;
    resetForm();
  } catch {
    message.value = "Erreur de suppression";
    isSuccess.value = false;
  }
};
const cancelDelete = () => {
  resetForm();          
  message.value = "";   
};

const resetForm = () => {
  nom.value = "";
  prenom.value = "";
  email.value = "";
  grade.value = "";
  statut.value = "";
  volume_statutaire.value = 0;
  searchQuery.value = "";
  suggestions.value = [];
  selectedProfId.value = null;
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