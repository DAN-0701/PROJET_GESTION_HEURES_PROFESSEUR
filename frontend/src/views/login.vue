<template>
  <div class="login-page">
    <div class="login-container">

      <!-- Left branding panel -->
      <div class="login-branding d-none d-md-flex">
        <div class="branding-content">
          <div class="branding-icon">
            <i class="bi bi-mortarboard-fill"></i>
          </div>
          <h2>Gestion des Heures</h2>
          <p>Plateforme de suivi et gestion des heures d'enseignement</p>
          <div class="branding-features">
            <div class="feature-item">
              <i class="bi bi-check-circle-fill"></i>
              <span>Suivi en temps réel</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill"></i>
              <span>Génération de paiements</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill"></i>
              <span>Statistiques détaillées</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right login form -->
      <div class="login-form-side">
        <div class="login-form-wrapper">

          <div class="login-header">
            <div class="login-logo">
              <i class="bi bi-box-arrow-in-right"></i>
            </div>
            <h3>Connexion</h3>
            <p class="text-muted">Entrez vos identifiants pour accéder à votre espace</p>
          </div>

          <div v-if="erreur" class="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i>
            {{ erreur }}
          </div>

          <form @submit.prevent="login">

            <!-- Email -->
            <div class="mb-3">
              <label class="form-label">Email</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-envelope-fill"></i>
                </span>
                <input
                  type="email"
                  class="form-control"
                  v-model="email"
                  placeholder="votreemail@exemple.com"
                  required
                />
              </div>
            </div>

            <!-- Mot de passe -->
            <div class="mb-4">
              <label class="form-label">Mot de passe</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-lock-fill"></i>
                </span>
                <input
                  :type="showPass ? 'text' : 'password'"
                  class="form-control"
                  v-model="pass"
                  placeholder="••••••••"
                  required
                />
                <button
                  class="input-group-text toggle-pass"
                  type="button"
                  @click="showPass = !showPass"
                >
                  <i class="bi" :class="showPass ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Boutons -->
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary btn-lg">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Se connecter
              </button>

              <button
                type="reset"
                class="btn btn-outline-secondary"
                @click="resetForm"
              >
                <i class="bi bi-arrow-counterclockwise me-1"></i>
                Réinitialiser
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const email = ref("");
const pass = ref("");
const erreur = ref("");
const showPass = ref(false);

const login = async () => {
  erreur.value = "";

  try {
    const res = await api.post(
      "/login",
      {
        email: email.value,
        password: pass.value,
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    // ✅ Changement de mot de passe obligatoire
    if (res.data.forceChangePassword === true) {
      router.push("/updatepassword");
      return;
    }

    const user = {
      iduser: res.data.iduser,
      idprof: res.data.idprof ?? null,
      nom: res.data.nom,
      prenom: res.data.prenom ?? "",
      role: res.data.role,
    };

    localStorage.setItem("user", JSON.stringify(user));

    // ✅ Redirection selon le rôle
    if (user.role === "administrateur") {
      router.push("/admin/dashbordadmin");
    } else if (user.role === "professeur") {
      router.push("/professeur/dashbordprof");
    } else if (user.role === "ressource humaine") {
      router.push("/ressource/dashbordrh");
    }

  } catch (error) {
    console.log("❌ Erreur Axios:", error);

    if (error.response) {
      erreur.value = error.response.data.message || "Erreur de connexion";
    } else {
      erreur.value = "Impossible de contacter le serveur";
    }
  }
};

const resetForm = () => {
  email.value = "";
  pass.value = "";
  erreur.value = "";
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e1e2f 0%, #3a0ca3 50%, #4361ee 100%);
  padding: 20px;
}

.login-container {
  display: flex;
  width: 900px;
  max-width: 100%;
  min-height: 540px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0,0,0,.3);
}

/* ── Left branding ── */
.login-branding {
  flex: 1;
  background: linear-gradient(160deg, #1e1e2f 0%, #3a0ca3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 36px;
  position: relative;
  overflow: hidden;
}
.login-branding::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(67,97,238,.2);
  border-radius: 50%;
  top: -80px;
  right: -80px;
}
.login-branding::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(247,37,133,.15);
  border-radius: 50%;
  bottom: -60px;
  left: -40px;
}

.branding-content {
  position: relative;
  z-index: 1;
  color: #fff;
}

.branding-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(255,255,255,.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.branding-content h2 {
  color: #fff;
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.branding-content p {
  color: rgba(255,255,255,.65);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 28px;
}

.branding-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,.8);
  font-size: 0.85rem;
}
.feature-item i {
  color: #06d6a0;
}

/* ── Right form ── */
.login-form-side {
  flex: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 36px;
}

.login-form-wrapper {
  width: 100%;
  max-width: 360px;
  animation: fadeInUp 0.5s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.login-logo {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: white;
  margin-bottom: 14px;
}

.login-header h3 {
  font-size: 1.4rem;
  margin-bottom: 4px;
}

.login-header p {
  font-size: 0.82rem;
}

/* Input group */
.input-group-text {
  background: #f8f9fa;
  border-right: none;
  color: #6c757d;
}
.input-group .form-control {
  border-left: none;
}
.input-group .form-control:focus {
  box-shadow: none;
  border-color: #dee2e6;
}
.input-group:focus-within {
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  border-radius: 8px;
}
.input-group:focus-within .input-group-text,
.input-group:focus-within .form-control {
  border-color: #4361ee;
}

.toggle-pass {
  cursor: pointer;
  border-left: none;
  background: #f8f9fa;
}

/* Btn */
.btn-lg {
  padding: 12px;
  font-size: 0.95rem;
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