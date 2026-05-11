<template>
  <div>
    <h1>Affectation Enseignant</h1>

    <!-- ✅ ZONE MODIFIÉE : boutons Nouvelle / Annuler -->
      <div class="mb-3 d-flex gap-2">
        <button class="btn btn-success" @click="openForm">
          ➕ Nouvelle affectation
        </button>

        <button
          class="btn btn-outline-secondary"
          v-if="showForm"
          @click="cancelForm"
        >
          ❌ Annuler
        </button>
</div>
<!-- ✅ FIN ZONE MODIFIÉE -->
    <!-- ✅ FIN ZONE MODIFIÉE 1 -->

    <!-- MESSAGE -->
    <div
      v-if="message"
      :class="[
        'alert d-flex justify-content-between align-items-center',
        isSuccess ? 'alert-success' : 'alert-danger'
      ]"
    >
      <span>{{ message }}</span>
      <button class="btn-close" @click="message = ''"></button>
    </div>

    <!-- ✅ ZONE MODIFIÉE 2 : formulaire affiché conditionnellement -->
    <div class="card mt-4" v-if="showForm">
      <div class="card-header bg-primary text-white text-center">
        <!-- ✅ ZONE MODIFIÉE 3 : titre dynamique -->
        {{ editId ? 'Modifier affectation' : 'Nouvelle affectation' }}
      </div>

      <div class="card-body">
        <form @submit.prevent="createAffectation">

          <!-- PROFESSEUR -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-person-badge me-1"></i> Professeur
            </label>
            <select class="form-select" v-model="matproff" required>
              <option value="" disabled>— Sélectionner un professeur —</option>
              <option v-for="p in professeurs" :key="p.matprof" :value="p.matprof">
                {{ p.nomprof }} {{ p.prenprof }}
              </option>
            </select>
          </div>

          <!-- MATIÈRE -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-book me-1"></i> Matière
            </label>
            <select class="form-select" v-model="idmat" required>
              <option value="" disabled>— Sélectionner une matière —</option>
              <option v-for="m in matieres" :key="m.idmat" :value="m.idmat">
                {{ m.libmat }}
              </option>
            </select>
          </div>

          <hr class="my-4">

          <!-- FILIÈRE -->
          <fieldset class="border rounded-3 p-3 mb-4">
            <legend class="float-none w-auto px-2 fs-6 fw-semibold text-primary">
              <i class="bi bi-diagram-3 me-1"></i> Filière
            </legend>

            <select class="form-select mb-3" v-model="idfil" required>
              <option value="" disabled>— Sélectionner une filière —</option>
              <option v-for="f in filieres" :key="f.idfil" :value="f.idfil">
                {{ f.libfil }}
              </option>
            </select>

            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light">Nouvelle</span>
              <input
                type="text"
                class="form-control"
                placeholder="Ex : Développement"
                v-model="newFiliere"
              />
              <button type="button" class="btn btn-outline-primary" @click="addFiliere">
                <i class="bi bi-plus-lg"></i> Ajouter
              </button>
            </div>
          </fieldset>

          <!-- NIVEAU -->
          <fieldset class="border rounded-3 p-3 mb-4">
            <legend class="float-none w-auto px-2 fs-6 fw-semibold text-primary">
              <i class="bi bi-bar-chart-steps me-1"></i> Niveau
            </legend>

            <select class="form-select mb-3" v-model="idniv" required>
              <option value="" disabled>— Sélectionner un niveau —</option>
              <option v-for="n in niveaux" :key="n.idniv" :value="n.idniv">
                {{ n.libniv }}
              </option>
            </select>

            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light">Nouveau</span>
              <input
                type="text"
                class="form-control"
                placeholder="Ex : Licence 3"
                v-model="newNiveau"
              />
              <button type="button" class="btn btn-outline-primary" @click="addNiveau">
                <i class="bi bi-plus-lg"></i> Ajouter
              </button>
            </div>
          </fieldset>

          <!-- DÉPARTEMENT -->
          <fieldset class="border rounded-3 p-3 mb-4">
            <legend class="float-none w-auto px-2 fs-6 fw-semibold text-primary">
              <i class="bi bi-building me-1"></i> Département
            </legend>

            <select class="form-select mb-3" v-model="iddep" required>
              <option value="" disabled>— Sélectionner un département —</option>
              <option v-for="d in departements" :key="d.iddep" :value="d.iddep">
                {{ d.libdep }}
              </option>
            </select>

            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light">Nouveau</span>
              <input
                type="text"
                class="form-control"
                placeholder="Ex : Informatique"
                v-model="newDepartement"
              />
              <button type="button" class="btn btn-outline-primary" @click="addDepartement">
                <i class="bi bi-plus-lg"></i> Ajouter
              </button>
            </div>
          </fieldset>

          <!-- ACTION -->
          <button type="submit" class="btn btn-success w-100 py-2 fw-semibold">
            <i class="bi bi-check-circle me-1"></i>
            {{ editId ? 'Modifier' : 'Affecter' }}
          </button>

        </form>
      </div>
    </div>
    <!-- ✅ FIN ZONE MODIFIÉE 2 -->

    <!-- LISTE DES AFFECTATIONS -->
    <div class="card mt-5">
      <div class="card-header bg-secondary text-white">
        Affectations existantes
      </div>

      <div class="card-body">
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="🔍 Rechercher par nom ou prénom du professeur..."
            v-model="search"
          />
        </div>
      </div>

      <table class="table table-bordered mb-0">
        <thead>
          <tr>
            <th>Professeur</th>
            <th>Matière</th>
            <th>Filière</th>
            <th>Niveau</th>
            <th>Année</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="filteredAffectations.length === 0">
            <td colspan="6" class="text-center text-muted">
              Aucun professeur trouvé
            </td>
          </tr>

          <tr v-for="a in filteredAffectations" :key="a.idaff">
            <td>{{ a.nomprof }} {{ a.prenprof }}</td>
            <td>{{ a.libmat }}</td>
            <td>{{ a.libfil }}</td>
            <td>{{ a.libniv }}</td>
            <td>{{ a.libeanne }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-1" @click="editAffectation(a)">
                Modifier
              </button>

              <button class="btn btn-primary btn-sm me-1" @click="addAnotherAffectation(a)">
                Ajouter
              </button>

              <button class="btn btn-danger btn-sm" @click="deleteAffectation(a.idaff)">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api.js";

/* ================================
   ÉTAT GLOBAL
================================ */

const editId = ref(null);
const message = ref("");
const isSuccess = ref(null);

/* ✅ ZONE MODIFIÉE 1 : état d’affichage du formulaire */
const showForm = ref(false);
/* ✅ FIN ZONE MODIFIÉE 1 */

const matproff = ref("");
const idmat = ref("");
const idfil = ref("");
const idniv = ref("");
const iddep = ref("");

const newFiliere = ref("");
const newNiveau = ref("");
const newDepartement = ref("");

const professeurs = ref([]);
const matieres = ref([]);
const filieres = ref([]);
const niveaux = ref([]);
const departements = ref([]);
const affectations = ref([]);
const search = ref("");

/* ================================
   CHARGEMENT DES DONNÉES
================================ */

const loadData = async () => {
  professeurs.value = (await api.get("/professeurs")).data;
  matieres.value = (await api.get("/matieres")).data;
  filieres.value = (await api.get("/filieres")).data;
  niveaux.value = (await api.get("/niveaux")).data;
  departements.value = (await api.get("/departements")).data;
  affectations.value = (await api.get("/affectations")).data;
};

onMounted(loadData);

/* ================================
   FILTRAGE RECHERCHE
================================ */

const filteredAffectations = computed(() => {
  if (!search.value) return affectations.value;

  return affectations.value.filter(a =>
    `${a.nomprof} ${a.prenprof}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});

/* ================================
   CRÉATION / MODIFICATION
================================ */

const createAffectation = async () => {
  try {
    if (editId.value) {
      /* ✅ ZONE MODIFIÉE 2 : mode MODIFICATION */
      await api.put(`/affectations/${editId.value}`, {
        idmat: idmat.value,
        idfil: idfil.value,
        idniv: idniv.value
      });

      message.value = "✅ Affectation modifiée";
    } else {
      /* ✅ ZONE MODIFIÉE 3 : mode AJOUT */
      await api.post("/affectations", {
        matproff: matproff.value,
        idmat: idmat.value,
        idfil: idfil.value,
        idniv: idniv.value,
        iddep: iddep.value
      });

      message.value = "✅ Nouvelle affectation ajoutée";
    }

    isSuccess.value = true;
    editId.value = null;

    /* ✅ ZONE MODIFIÉE 4 : masquer le formulaire après succès */
    showForm.value = false;
    /* ✅ FIN ZONE MODIFIÉE 4 */

    loadData();
  } catch {
    message.value = "❌ Erreur lors de l’opération";
    isSuccess.value = false;
  }
};

/* ================================
   AJOUT FILIÈRE
================================ */

const addFiliere = async () => {
  if (!newFiliere.value) return;
  await api.post("/filieres", { libfil: newFiliere.value });
  newFiliere.value = "";
  filieres.value = (await api.get("/filieres")).data;
};

/* ================================
   AJOUT NIVEAU
================================ */

const addNiveau = async () => {
  if (!newNiveau.value) return;
  await api.post("/niveaux", { libniv: newNiveau.value });
  newNiveau.value = "";
  niveaux.value = (await api.get("/niveaux")).data;
};

/* ================================
   AJOUT DÉPARTEMENT
================================ */

const addDepartement = async () => {
  if (!newDepartement.value) return;
  await api.post("/departements", { libdep: newDepartement.value });
  newDepartement.value = "";
  departements.value = (await api.get("/departements")).data;
};

/* ================================
   AJOUT NOUVELLE AFFECTATION
================================ */

const addAnotherAffectation = (a) => {
  // ✅ afficher le formulaire
  showForm.value = true;

  // ✅ même professeur
  matproff.value = a.matproff;

  // ✅ NOUVELLE affectation → on vide les autres champs
  idmat.value = "";
  idfil.value = "";
  idniv.value = "";
  iddep.value = a.iddep; // ✅ garder le même département (logique)

  editId.value = null;

  message.value = "➕ Nouvelle affectation pour ce professeur";
  isSuccess.value = true;
};

/* ================================
   MODIFICATION AFFECTATION
================================ */

const editAffectation = (a) => {
  // ✅ afficher le formulaire
  showForm.value = true;

  // ✅ passer en mode édition
  editId.value = a.idaff;

  // ✅ REMPLISSAGE DES CHAMPS
  matproff.value = a.matproff;
  idmat.value   = a.idmat;
  idfil.value   = a.idfil;
  idniv.value   = a.idniv;
  iddep.value   = a.iddep; // ✅ MANQUANT AVANT

  message.value = "✏️ Modification de l’affectation";
  isSuccess.value = true;
};

/* ================================
   SUPPRESSION
================================ */

const deleteAffectation = async (id) => {
  if (!confirm("Voulez-vous vraiment supprimer cette affectation ?")) return;
  try {
    await api.delete(`/affectations/${id}`);
    message.value = "✅ Affectation supprimée";
    isSuccess.value = true;
    loadData();
  } catch {
    message.value = "❌ Erreur lors de la suppression";
    isSuccess.value = false;
  }
};

/* ================================
   OUVRIR FORMULAIRE
================================ */
const openForm = () => {
  showForm.value = true;
  editId.value = null;

  // reset champs
  matproff.value = "";
  idmat.value = "";
  idfil.value = "";
  idniv.value = "";
  iddep.value = "";

  message.value = "";
};

/* ================================
   ANNULER FORMULAIRE
================================ */
const cancelForm = () => {
  showForm.value = false;
  editId.value = null;

  // reset champs
  matproff.value = "";
  idmat.value = "";
  idfil.value = "";
  idniv.value = "";
  iddep.value = "";

  message.value = "";
};
</script>
<style scoped>
h1 {
  color: #0d6efd;
  font-weight: bold;
}
</style>