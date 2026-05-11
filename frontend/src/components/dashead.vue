<template>
  <header class="app-header">
    <div class="header-left">
      <slot></slot>
    </div>

    <div class="header-right">
      <!-- Profile dropdown -->
      <div class="dropdown">
        <button
          class="profile-btn dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          id="profileDropdown"
        >
          <div class="profile-avatar">
            <i class="bi bi-person-fill"></i>
          </div>
          <span class="profile-name d-none d-md-inline">
            {{ userName }}
          </span>
          <i class="bi bi-chevron-down ms-1" style="font-size:.7rem"></i>
        </button>

        <ul class="dropdown-menu dropdown-menu-end shadow-lg" aria-labelledby="profileDropdown">
          <!-- Profil info -->
          <li class="dropdown-header px-3 py-2">
            <div class="fw-bold">{{ userName }}</div>
            <small class="text-muted">{{ userRole }}</small>
          </li>
          <li><hr class="dropdown-divider" /></li>

          <li>
            <a class="dropdown-item d-flex align-items-center gap-2 py-2 px-3" href="#" @click.prevent="showProfile = true">
              <i class="bi bi-person-badge text-primary"></i>
              Mon profil
            </a>
          </li>
          <li>
            <router-link class="dropdown-item d-flex align-items-center gap-2 py-2 px-3" to="/updatepassword">
              <i class="bi bi-key-fill text-warning"></i>
              Modifier mot de passe
            </router-link>
          </li>

          <li><hr class="dropdown-divider" /></li>

          <li>
            <a class="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-danger" href="#" @click.prevent="logout">
              <i class="bi bi-box-arrow-right"></i>
              Déconnexion
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Profile Modal -->
    <div v-if="showProfile" class="modal-overlay" @click.self="showProfile = false">
      <div class="profile-modal fade-in-up">
        <div class="profile-modal-header">
          <h5 class="m-0"><i class="bi bi-person-badge me-2"></i>Mon profil</h5>
          <button class="btn-close btn-close-white" @click="showProfile = false"></button>
        </div>
        <div class="profile-modal-body">
          <div class="profile-modal-avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <div class="profile-info-list">
            <div class="profile-info-item">
              <span class="profile-info-label">Nom</span>
              <span class="profile-info-value">{{ user.nom || '—' }}</span>
            </div>
            <div class="profile-info-item">
              <span class="profile-info-label">Prénom</span>
              <span class="profile-info-value">{{ user.prenom || '—' }}</span>
            </div>
            <div class="profile-info-item">
              <span class="profile-info-label">Rôle</span>
              <span class="profile-info-value">
                <span class="badge bg-primary">{{ userRole }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="profile-modal-footer">
          <button class="btn btn-sm btn-outline-light" @click="showProfile = false">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api.js";

const router = useRouter();

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));

const userName = computed(() => {
  const n = user.value.nom || "";
  const p = user.value.prenom || "";
  return `${p} ${n}`.trim() || "Utilisateur";
});

const userRole = computed(() =>
  user.value.role ? user.value.role.charAt(0).toUpperCase() + user.value.role.slice(1) : "—"
);

const showProfile = ref(false);

const logout = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  } finally {
    localStorage.removeItem("user");
    router.push("/");
  }
};
</script>

<style scoped>
.app-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: linear-gradient(135deg, #1e1e2f 0%, #3a0ca3 100%);
  color: #f8f9fa;
  box-shadow: 0 2px 12px rgba(0,0,0,.15);
  position: relative;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
}

.header-right {
  display: flex;
  align-items: center;
}

/* ── Profile button ── */
.profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 50px;
  color: #f8f9fa;
  padding: 5px 14px 5px 5px;
  cursor: pointer;
  transition: all .25s ease;
  font-size: 0.85rem;
  font-weight: 500;
}
.profile-btn:hover,
.profile-btn:focus {
  background: rgba(255,255,255,.2);
  color: #fff;
}
.profile-btn::after {
  display: none; /* hide default caret */
}

.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361ee, #f72585);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
}

.profile-name {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Dropdown ── */
.dropdown-menu {
  border: none;
  border-radius: 12px;
  padding: 8px;
  min-width: 220px;
  margin-top: 8px;
}
.dropdown-item {
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background .2s ease;
}
.dropdown-item:hover {
  background: #f0f2f5;
}
.dropdown-header {
  font-size: 0.85rem;
}

/* ── Profile Modal Overlay ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.profile-modal {
  width: 400px;
  max-width: 92vw;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,.3);
}

.profile-modal-header {
  background: linear-gradient(135deg, #1e1e2f, #3a0ca3);
  color: #fff;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-modal-body {
  background: #fff;
  padding: 30px 24px;
  text-align: center;
}

.profile-modal-avatar {
  font-size: 4rem;
  color: #4361ee;
  margin-bottom: 20px;
}

.profile-info-list {
  text-align: left;
}

.profile-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.profile-info-item:last-child {
  border-bottom: none;
}

.profile-info-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.profile-info-value {
  font-weight: 600;
  color: #1e1e2f;
}

.profile-modal-footer {
  background: linear-gradient(135deg, #1e1e2f, #3a0ca3);
  padding: 12px 24px;
  text-align: right;
}
</style>