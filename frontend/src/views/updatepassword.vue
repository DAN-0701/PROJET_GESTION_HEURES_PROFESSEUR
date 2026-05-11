<template>
  <div class="update-page">
    <div class="update-container">

      <div class="card update-card">

        <div v-if="message" class="alert alert-danger m-3 mb-0 d-flex align-items-center gap-2">
          <i class="bi bi-exclamation-triangle-fill"></i>
          {{ message }}
        </div>

        <div class="card-header bg-warning text-dark text-center">
          <i class="bi bi-shield-lock-fill me-2"></i>
          <strong>Changement obligatoire du mot de passe</strong>
        </div>

        <div class="card-body">
          <p class="text-muted small mb-4">
            <i class="bi bi-info-circle me-1"></i>
            Pour des raisons de sécurité, vous devez définir un nouveau mot de passe.
          </p>

          <!-- Mot de passe -->
          <div class="mb-2">
            <label class="form-label">Nouveau mot de passe</label>
            <input
              type="password"
              class="form-control"
              v-model="password"
              placeholder="••••••••"
            />
          </div>

          <!-- ✅ règles en temps réel -->
          <div class="mb-3">
            <div class="rules-list">
              <div class="rule-item" :class="rules.longueur ? 'valid' : 'invalid'">
                <i class="bi" :class="rules.longueur ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                8 caractères minimum
              </div>
              <div class="rule-item" :class="rules.majuscule ? 'valid' : 'invalid'">
                <i class="bi" :class="rules.majuscule ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                1 majuscule
              </div>
              <div class="rule-item" :class="rules.minuscule ? 'valid' : 'invalid'">
                <i class="bi" :class="rules.minuscule ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                1 minuscule
              </div>
              <div class="rule-item" :class="rules.chiffre ? 'valid' : 'invalid'">
                <i class="bi" :class="rules.chiffre ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                1 chiffre
              </div>
              <div class="rule-item" :class="rules.symbole ? 'valid' : 'invalid'">
                <i class="bi" :class="rules.symbole ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                1 symbole
              </div>
            </div>
          </div>

          <!-- Confirmation -->
          <div class="mb-4">
            <label class="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              class="form-control"
              v-model="confirm"
              placeholder="••••••••"
            />
          </div>

          <!-- ✅ bouton -->
          <button
            class="btn btn-primary w-100"
            :disabled="!isFormValid"
            :class="{ 'opacity-50': !isFormValid }"
            @click="submit"
          >
            <i class="bi bi-check-lg me-2"></i>
            Enregistrer le nouveau mot de passe
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import api from "../services/api.js";
import { useRouter } from "vue-router";

const password = ref("");
const confirm = ref("");
const message = ref("");
const router = useRouter();

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// ✅ règles individuelles (temps réel)
const rules = computed(() => ({
  longueur: password.value.length >= 8,
  majuscule: /[A-Z]/.test(password.value),
  minuscule: /[a-z]/.test(password.value),
  chiffre: /\d/.test(password.value),
  symbole: /[^A-Za-z0-9]/.test(password.value),
}));

// ✅ mot de passe valide
const isPasswordValid = computed(() =>
  Object.values(rules.value).every(Boolean)
);

// ✅ confirmation valide
const isMatching = computed(() =>
  password.value && password.value === confirm.value
);

// ✅ formulaire valide
const isFormValid = computed(() =>
  isPasswordValid.value && isMatching.value
);

const submit = async () => {
  message.value = "";

  if (!isFormValid.value) {
    message.value = "Mot de passe invalide";
    return;
  }

  try {
    await api.put("/updatepassword", {
      newPassword: password.value
    });

    router.push("/");
  } catch (error) {
    message.value = "Erreur lors de la mise à jour du mot de passe";
    console.error(error);
  }
};
</script>

<style scoped>
.update-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e1e2f 0%, #3a0ca3 50%, #4361ee 100%);
  padding: 20px;
}

.update-container {
  width: 440px;
  max-width: 100%;
  animation: fadeInUp 0.5s ease-out;
}

.update-card {
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
}

/* Rules */
.rules-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: color .2s ease;
}

.rule-item.valid {
  color: #06d6a0;
}
.rule-item.invalid {
  color: #ef476f;
}

.rule-item i {
  font-size: 0.9rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
