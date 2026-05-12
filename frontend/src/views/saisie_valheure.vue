<template>
  <div class="card mb-4">
    <div class="card-header bg-primary text-white">
      Saisie des heures réalisées
    </div>
    
    <!-- MESSAGE -->
    <div v-if="message" 
         :class="['alert d-flex justify-content-between align-items-center mt-4 mx-3', 
                  isSuccess ? 'alert-success' : 'alert-danger']">
      <span>{{ message }}</span>
      <button type="button" class="btn-close" @click="message = ''"></button>
    </div>

    <div class="card-body">
      <div class="row g-3 align-items-end">

        <!-- Affectation -->
        <div class="col-md-4">
          <label class="form-label">Affectation</label>
          <select class="form-select" v-model="form.idaff">
            <option value="">Sélectionner</option>
            <option v-for="a in affectations" :key="a.idaff" :value="a.idaff">
              {{ a.nomprof }} {{ a.prenprof }} - {{ a.libmat }} ({{ a.libfil }} / {{ a.libniv }})
            </option>
          </select>
        </div>

        <!-- Date -->
        <div class="col-md-2">
          <label class="form-label">Date du cours</label>
          <input type="date" class="form-control" v-model="form.datecours" />
        </div>

        <!-- Type -->
        <div class="col-md-2">
          <label class="form-label">Type</label>
          <select class="form-select" v-model="form.libheure">
            <option value="CM">CM</option>
            <option value="TD">TD</option>
            <option value="TP">TP</option>
          </select>
        </div>

        <!-- Durée -->
        <div class="col-md-2">
          <label class="form-label">Durée (h)</label>
          <input type="number" min="1" class="form-control" v-model="form.nbheure" />
        </div>

        <!-- Salle -->
        <div class="col-md-2">
          <label class="form-label">Salle</label>
          <input type="text" class="form-control" v-model="form.salle" />
        </div>

        <!-- Bouton -->
        <div class="col-md-12 d-grid">
          <button class="btn btn-success" @click="ajouterHeure">
            Ajouter
          </button>
        </div>

      </div>
    </div>
  </div>

  <!-- TABLE DES HEURES -->
  <div class="card">
    <div class="card-header bg-secondary text-white">
      Heures saisies
    </div>

    <table class="table table-bordered table-hover mb-0">
      <thead class="table-light">
        <tr>
          <th>Professeur</th>
          <th>Matière</th>
          <th>Filière</th>
          <th>Niveau</th>
          <th>Date</th>
          <th>Type</th>
          <th>Durée</th>
          <th>Salle</th>
          <th>Statut</th>
          <th style="width:180px">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="h in heures" :key="h.idheure">
          <td>{{ h.nomprof }} {{ h.prenprof }}</td>
          <td>{{ h.libmat }}</td>
          <td>{{ h.libfil }}</td>
          <td>{{ h.libniv }}</td>
          <td>{{ h.datecours }}</td>
          <td>{{ h.libheure }}</td>
          <td>{{ h.nbheure }}</td>
          <td>{{ h.salle }}</td>
          <td>
            <div class="d-flex flex-column">
              <span
                class="badge"
                :class="getStatusBadgeClass(h.statut)"
              >
                {{ h.statut === 'refuse' ? 'Refus du professeur' : h.statut }}
              </span>
              <small v-if="h.statut === 'refuse' && h.motif_refus" class="text-danger mt-1 fw-bold">
                Motif: {{ h.motif_refus }}
              </small>
            </div>
          </td>

          <td>
            <div class="d-grid gap-2">
              <button
                class="btn btn-sm btn-success"
                v-if="h.statut === 'en_attente' || h.statut === 'refuse'"
                @click="validerHeure(h.idheure)"
              >
                {{ h.statut === 'refuse' ? 'Re-valider' : 'Valider' }}
              </button>

              <button
                class="btn btn-sm btn-info text-white"
                v-if="h.statut === 'refuse'"
                @click="reinitialiserHeure(h.idheure)"
              >
                Mettre en attente
              </button>

              <button
                class="btn btn-sm btn-warning"
                @click="openEdit(h)"
              >
                Modifier
              </button>

              <button
                class="btn btn-sm btn-danger"
                @click="supprimerHeure(h.idheure)"
              >
                Supprimer
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- MODAL MODIFICATION -->
  <div class="modal fade show d-block" v-if="editHeure" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

        <div class="modal-header bg-warning">
          <h5 class="modal-title">Modification de l’heure</h5>
          <button class="btn-close" @click="closeEdit"></button>
        </div>

        <div class="modal-body">
          <div class="row g-3">

            <div class="col-md-4">
              <label class="form-label">Date</label>
              <input type="date" class="form-control" v-model="editHeure.datecours" />
            </div>

            <div class="col-md-4">
              <label class="form-label">Type</label>
              <select class="form-select" v-model="editHeure.libheure">
                <option value="CM">CM</option>
                <option value="TD">TD</option>
                <option value="TP">TP</option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label">Durée</label>
              <input type="number" class="form-control" v-model="editHeure.nbheure" />
            </div>

            <div class="col-md-12">
              <label class="form-label">Salle</label>
              <input class="form-control" v-model="editHeure.salle" />
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeEdit">Annuler</button>
          <button class="btn btn-warning" @click="updateHeure">Enregistrer</button>
        </div>

      </div>
    </div>
  </div>

  <div class="modal-backdrop fade show" v-if="editHeure"></div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";

/* =========================
   ETATS
========================= */
const affectations = ref([]);
const heures = ref([]);
const editHeure = ref(null);
const message = ref("");
const isSuccess = ref(null);

const form = ref({
  idaff: "",
  datecours: "",
  libheure: "CM",
  nbheure: 1,
  salle: ""
});

/* =========================
   CHARGEMENT INITIAL
========================= */
const loadData = async () => {
  affectations.value = (await api.get("/affectations")).data;
  heures.value = (await api.get("/heures")).data;
};

const getStatusBadgeClass = (statut) => {
  switch (statut) {
    case "valide": return "bg-success";
    case "refuse": return "bg-danger";
    case "en_attente": return "bg-warning text-dark";
    default: return "bg-secondary";
  }
};

onMounted(loadData);

/* =========================
   SAISIE DES HEURES
========================= */
const ajouterHeure = async () => {
  try {
    await api.post("/heures", form.value);
    message.value = "✅ Heure ajoutée avec succès";
    isSuccess.value = true;

    form.value = {
      idaff: "",
      datecours: "",
      libheure: "CM",
      nbheure: 1,
      salle: ""
    };

    loadData();
  } catch (err) {
    console.error("❌ ERREUR BACKEND :", err.response?.data);
    message.value = err.response?.data?.sqlMessage || err.response?.data?.message || "Erreur inconnue";
    isSuccess.value = false;
  }
};

/* =========================
   VALIDATION
========================= */
const validerHeure = async (id) => {
  try {
    await api.put(`/heures/${id}/valider`);
    await loadData();
    message.value = "Heure validée avec succès";
    isSuccess.value = true;
  } catch (err) {
    message.value = err.response?.data?.message || "Erreur lors de la validation";
    isSuccess.value = false;
  }
};

/* =========================
   REINITIALISATION
========================= */
const reinitialiserHeure = async (id) => {
  try {
    await api.put(`/heures/${id}/reinitialiser`);
    loadData();
    message.value = "✅ Heure remise en attente";
    isSuccess.value = true;
  } catch {
    message.value = "❌ Erreur lors de la réinitialisation";
    isSuccess.value = false;
  }
};

/* =========================
   SUPPRESSION
========================= */
const supprimerHeure = async (id) => {
  if (!confirm("Supprimer cette heure ?")) return;
  try {
    await api.delete(`/heures/${id}`);
    await loadData();
    message.value = "Heure supprimée avec succès";
    isSuccess.value = true;
  } catch (err) {
    message.value = err.response?.data?.message || "Erreur lors de la suppression";
    isSuccess.value = false;
  }
};

/* =========================
   MODIFICATION
========================= */
const openEdit = (h) => {
  editHeure.value = { ...h };
};

const closeEdit = () => {
  editHeure.value = null;
};

const updateHeure = async () => {
  try {
    await api.put(`/heures/${editHeure.value.idheure}`, {
      libheure: editHeure.value.libheure,
      nbheure: editHeure.value.nbheure,
      datecours: editHeure.value.datecours,
      salle: editHeure.value.salle
    });

    editHeure.value = null;
    loadData();
    message.value = "✅ Heure modifiée avec succès";
    isSuccess.value = true;
  } catch {
    message.value = "❌ Erreur lors de la modification";
    isSuccess.value = false;
  }
};
</script>
