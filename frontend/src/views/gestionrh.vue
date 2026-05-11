<template>
  <div>
    <h1>Gestion des RH</h1>
    <p>Bienvenue dans la section de gestion des RH</p>
  </div>
    <div class="row">
      <!-- Card Création -->
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3 class="card-title">Création</h3>
            <p class="card-text">Ajoutez un nouveau profil RH.</p>
            <button class="btn btn-primary w-100" @click="activeForm = activeForm === 'create' ? null : 'create'">Créer</button>
          </div>
        </div>
      </div>

      <!-- Card Modification -->
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3 class="card-title">Modification</h3>
            <p class="card-text">Modifiez un profil RH facilement.</p>
            <button class="btn btn-warning w-100" @click="activeForm = activeForm === 'mod' ? null : 'mod'">Modifier</button>
          </div>
        </div>
      </div>

      <!-- Card Suppression -->
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <h3 class="card-title">Suppression</h3>
            <p class="card-text">Supprimez un profil RH .</p>
            <button class="btn btn-danger w-100" @click="activeForm = activeForm === 'del' ? null : 'del'">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- MESSAGE -->
    <div v-if="message" 
         :class="['alert d-flex justify-content-between align-items-center mt-4', 
                  isSuccess ? 'alert-success' : 'alert-danger']">
      <span>{{ message }}</span>
      <button type="button" class="btn-close" @click="message = ''"></button>
    </div>

    <!-- message -->

    <!-- formulaire de creation -->
  <Transition name="fcreate">
    <div class="card border border-1 border-secondary shadow-sm bg-light mt-5 custom-shadow" v-if="activeForm === 'create'" mode="in-out">
      <!-- Message affiché au-dessus du formulaire -->
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">Formulaire de Création</h4>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
              <!-- Nom et Prénom -->
              <div class="row mb-4">
                <div class="col">
                  <label for="lastName" class="form-label">Nom</label>
                  <input
                    type="text"
                    id="lastName"
                    class="form-control"
                    placeholder="Votre nom"
                    required
                    v-model="nom"
                  />
                </div>
                <div class="col">
                  <label for="firstName" class="form-label">Prénom</label>
                  <input
                    type="text"
                    id="firstName"
                    class="form-control"
                    placeholder="Votre prénom"
                    required
                    v-model="prenom"
                  />
                </div>
              </div>

              <!-- Email et Mot de passe -->
              <div class="row mb-4">
                <div class="col">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    class="form-control"
                    placeholder="Votre email"
                    required
                    v-model="email"
                  />
                </div>
              </div>

              <!-- role -->
              <div class="row mb-4">
                <div class="col">
                  <label for="grade" class="form-label">role</label>
                  <select id="grade" class="form-select" required v-model="role">
                    <option value="">Sélectionnez...</option>
                    <option>Administrateur</option>
                    <option>Ressources humaines</option>
                    <option>Professeur</option>
                  </select>
                </div>
              </div>

              <!-- Boutons -->
              <div class="d-flex justify-content-between">
                <button type="reset" class="btn btn-outline-secondary w-50 me-2" @click="resetForm">Reset</button>
                <button type="submit" class="btn btn-primary w-50">Ajouter</button>
              </div>
          </form>

        </div>
      </div>
    </Transition>

    <!-- formulaire de modification -->
    <Transition name="fcreate">
  <div class="card border border-1 border-secondary shadow-sm bg-light mt-5 custom-shadow" 
       v-if="activeForm === 'mod'" mode="in-out">

    <!-- Champ de recherche -->
    <div class="mb-3 position-relative p-3">
      <input type="search" 
             class="form-control mb-2" 
             placeholder="Rechercher par nom..." 
             v-model="searchQuery"
             style="padding: 10px; border-radius: 6px;" />

      <!-- Suggestions -->
      <ul v-if="suggestions.length" 
          class="list-group position-absolute w-100 mt-1 shadow-sm" 
          style="z-index: 1000;">
        <li v-for="rh in suggestions" 
            :key="rh.iduser"
            class="list-group-item list-group-item-action"
            @click="selectAdmin(rh)">
          {{ rh.nomuser }} {{ rh.prenuser }}
        </li>
      </ul>
    </div>


    <!-- En-tête -->
    <div class="card-header bg-warning text-white">
      <h4 class="mb-0" style="color: black;">Formulaire de Modification</h4>
    </div>

    <!-- Corps -->
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <!-- Nom et Prénom -->
        <div class="row mb-4">
          <div class="col">
            <label for="lastName" class="form-label">Nom</label>
            <input type="text" id="lastName" class="form-control" placeholder="Votre nom" required v-model="nom" />
          </div>
          <div class="col">
            <label for="firstName" class="form-label">Prénom</label>
            <input type="text" id="firstName" class="form-control" placeholder="Votre prénom" required v-model="prenom" />
          </div>
        </div>

        <!-- Email et Mot de passe -->
        <div class="row mb-4">
          <div class="col">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" placeholder="Votre email" required v-model="email" />
          </div>
        </div>

        <!-- Rôle -->
          <div class="row mb-4">
          <div class="col">
            <label for="grade" class="form-label">Rôle</label>
            <select id="role" class="form-select" required v-model="role">
              <option value="">Sélectionnez...</option>
              <option value="administrateur">Administrateur</option>
              <option value="ressource humaine">Ressources humaines</option>
              <option value="professeur">Professeur</option>
            </select>
          </div>
        </div>
        
        <!-- Boutons -->
        <div class="d-flex justify-content-between">
          <button type="reset" class="btn btn-outline-secondary w-50 me-2" @click="resetForm">Reset</button>
          <button type="submit" class="btn btn-warning w-50">Modifier</button>
        </div>
      </form>
    </div>
  </div>
</Transition>
  <!-- listage-->
      <Transition name="fcreate">
      <!-- ✅ LISTE DES ADMINISTRATEURS -->
      <div v-if="activeForm === null" class="mt-5">

        <h3 class="mb-3">Liste des agents des ressources humaine</h3>

        <div v-if="loadingAdmins" class="text-muted">
          Chargement...
        </div>

        <div v-else class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead class="table-dark">
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Rôle</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="admins.length === 0">
                <td colspan="3" class="text-center text-muted">
                  Aucun administrateur trouvé
                </td>
              </tr>

              <tr v-for="admin in admins" :key="admin.iduser"style="cursor: pointer"@click="
             ">
                <td>{{ admin.nomuser }}</td>
                <td>{{ admin.prenuser }}</td>
                <td>
                  <span class="badge bg-primary">
                    {{ admin.roleuser }}
                  </span>
                </td>
                <td class="text-center">
              <button
                class="btn btn-sm btn-warning"
                @click="selectTauxHoraire(admin)"
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

    <!-- formulaire de suppression -->
  <Transition name="fcreate">
  <div class="card border border-1 border-secondary shadow-sm bg-light mt-5 custom-shadow" 
       v-if="activeForm === 'del'" mode="in-out">

    <!-- Champ de recherche -->
    <div class="mb-3 position-relative p-3">
      <input type="search" 
             class="form-control mb-2" 
             placeholder="Rechercher par nom..." 
             v-model="searchQuery"
             style="padding: 10px; border-radius: 6px;" />

      <!-- Suggestions -->
      <ul v-if="suggestions.length" 
          class="list-group position-absolute w-100 mt-1 shadow-sm" 
          style="z-index: 1000;">
        <li v-for="rh in suggestions" 
            :key="rh.iduser"
            class="list-group-item list-group-item-action"
            @click="selectAdmin(rh)">
          {{ rh.nomuser }} {{ rh.prenuser }}
        </li>
      </ul>
    </div>


    <!-- En-tête -->
    <div class="card-header bg-danger text-white">
      <h4 class="mb-0">Formulaire de Suppression</h4>
    </div>

    <!-- Corps -->
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <!-- Nom et Prénom -->
        <div class="row mb-4">
          <div class="col">
            <label for="lastName" class="form-label">Nom</label>
            <input type="text" id="lastName" class="form-control" placeholder="Votre nom"  disabled v-model="nom" />
          </div>
          <div class="col">
            <label for="firstName" class="form-label">Prénom</label>
            <input type="text" id="firstName" class="form-control" placeholder="Votre prénom" disabled v-model="prenom" />
          </div>
        </div>

        <!-- Email  -->
        <div class="row mb-4">
          <div class="col">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" placeholder="Votre email" disabled="" v-model="email" />
          </div>
        </div>

        
        <!-- Boutons -->
        <div class="d-flex justify-content-between">
          <button type="reset" class="btn btn-outline-secondary w-50 me-2" @click="resetForm">Reset</button>
          <button type="submit" class="btn btn-danger w-50">Supprimer</button>
        </div>
      </form>
    </div>
  </div>
</Transition>

</template>


<script setup>
//creation d'un rh
import { ref,watch } from 'vue'
import api from '../services/api.js'
import { onMounted } from "vue";
const activeForm = ref(null)
const nom = ref('')
const prenom = ref('') 
const email = ref('')
const pass = ref('')
const role = ref('')
const message = ref('')
const isSuccess = ref(null)
const admins = ref([]);
const loadingAdmins = ref(false);

const loadAdmins = async () => {
  loadingAdmins.value = true;
  try {
    const res = await api.get("/rhlist");
    console.log("STATUS =", res.status);
    console.log("DATA =", res.data);
    admins.value = res.data;
  } catch (error) {
    console.error("Erreur chargement des rh", error);
  } finally {
    loadingAdmins.value = false;
  }
};

// ✅ Charger la liste au montage
onMounted(loadAdmins);
const selectTauxHoraire = (admin) => {
  selectedrhId.value = admin.iduser
  nom.value = admin.nomuser
  prenom.value = admin.prenuser
  email.value = admin.emailuser
  role.value = admin.roleuser
  activeForm.value = "mod";
};
// ✅ Recharger la liste quand on ferme un formulaire
watch(activeForm, (newVal) => {
  if (newVal === null) {
    loadAdmins();
  }
});

const create = async () => {
  try {
    const response = await api.post('/rh', {
      nom: nom.value,
      prenom: prenom.value,
      email: email.value,
      role:role.value
    })
    message.value = response.data.message
    isSuccess.value = response.data.success
    resetForm()
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      message.value = error.response.data.message
      isSuccess.value = false
    } else {
      message.value = "Erreur de communication avec le serveur"
      isSuccess.value = false
    }
  }
}

//modification d'un admin
const searchQuery = ref('')
const suggestions = ref([])

// Surveille la saisie et lance la recherche
watch(searchQuery, async (newVal) => {
  if (newVal.length >= 2) {
    try {
      const response = await api.get(`/rh/search?q=${newVal}`)
      suggestions.value = response.data
    } catch (error) {
      console.error(error)
    }
  } else {
    suggestions.value = []
  }
})
const selectedrhId = ref(null)
const selectAdmin = (rh) => {
  selectedrhId.value = rh.iduser
  nom.value = rh.nomuser
  prenom.value = rh.prenuser
  email.value = rh.emailuser
  role.value = rh.roleuser
  message.value = "✅ Profil RH trouvé"
  isSuccess.value = true
  
  suggestions.value = [];
  searchQuery.value = ""

}
// envoie pour modification
const updaterh = async () => {
  try {
const response = await api.put(`/rh/${selectedrhId.value}`, {
  nom: nom.value,
  prenom: prenom.value,
  email: email.value,
  role: role.value
})
    message.value = response.data.message
    isSuccess.value = response.data.success
    resetForm()
  } catch (error) {
    message.value = error.response?.data?.message || "Erreur de mise à jour"
    isSuccess.value = false
  }
}

//envoie pour suppression
const deleterh = async () => {
  try {
    const response = await api.delete(`/rh/${selectedrhId.value}`)
    message.value = response.data.message
    isSuccess.value = response.data.success
    resetForm()
  } catch (error) {
    message.value = error.response?.data?.message || "Erreur de suppression"
    isSuccess.value = false
  }
}

const resetForm = () => {
  nom.value = ""
  prenom.value = ""
  email.value = ""
  role.value = ""
  searchQuery.value = ""
  suggestions.value = []
  selectedrhId.value = null
}
const handleSubmit = () => {
  if (activeForm.value === 'create') {
    create()
  } else if (activeForm.value === 'mod') {
    if (!selectedrhId.value) {
      message.value = "⚠️ Aucun profil RH sélectionné"
      isSuccess.value = false
      return
    }
    updaterh()
  } else if (activeForm.value === 'del') {
    if (!selectedrhId.value) {
      message.value = "⚠️ Aucun profil RH sélectionné"
      isSuccess.value = false
      return
    }
    deleterh()
  }
}


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