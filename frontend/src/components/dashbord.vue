<template>
  <div class="d-flex" style="min-height: 100%;">

    <!-- SIDEBAR -->
    <nav
      class="sidebar-nav"
      :class="{ collapsed: isCollapsed }"
    >
      <div class="sidebar-inner">

        <!-- Header + Burger -->
        <div class="sidebar-header">
          <h5 v-if="!isCollapsed" class="sidebar-title">
            <i class="bi bi-grid-fill me-2"></i>MENU
          </h5>
          <button class="sidebar-toggle" @click="toggleSidebar">
            <i class="bi" :class="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
          </button>
        </div>

        <!-- MENU -->
        <ul class="nav flex-column sidebar-menu">

          <li class="nav-item">
            <router-link class="nav-link" to="/admin/dashbordadmin">
              <i class="bi bi-speedometer2"></i>
              <span v-if="!isCollapsed">Tableau de bord</span>
            </router-link>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-people-fill"></i>
              <span v-if="!isCollapsed">Configuration utilisateurs</span>
            </a>

            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/admin/gestionadmin">
                  <i class="bi bi-person-gear me-2"></i>Gestion Administrateur
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/admin/gestionrh">
                  <i class="bi bi-person-badge me-2"></i>Gestion RH
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/admin/gestionprof">
                  <i class="bi bi-person-video3 me-2"></i>Gestion Professeur
                </router-link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/admin/affectation">
              <i class="bi bi-list-check"></i>
              <span v-if="!isCollapsed">Affectation enseignant</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/admin/gestionannee">
              <i class="bi bi-calendar-event-fill"></i>
              <span v-if="!isCollapsed">Paramétrage des années</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/admin/thoraire">
              <i class="bi bi-cash-stack"></i>
              <span v-if="!isCollapsed">Taux horaire</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/admin/parametrage">
              <i class="bi bi-sliders"></i>
              <span v-if="!isCollapsed">Équivalences horaires</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/admin/gestionmatiere">
              <i class="bi bi-journal-text"></i>
              <span v-if="!isCollapsed">Matières</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/admin/journallog">
              <i class="bi bi-book-fill"></i>
              <span v-if="!isCollapsed">Journal des logs</span>
            </router-link>
          </li>
        </ul>

      </div>
    </nav>

    <!-- CONTENU -->
    <main class="main-content flex-grow-1">
      <div class="content-wrapper">
        <slot />
      </div>
    </main>

  </div>
</template>
<script setup>
import { ref } from "vue";

const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>
<style scoped>
.sidebar-nav {
  width: 270px;
  min-height: 100%;
  background: linear-gradient(180deg, #1e1e2f 0%, #2d2d44 100%);
  transition: width 0.35s cubic-bezier(.4,0,.2,1);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-nav.collapsed {
  width: 72px;
}

.sidebar-inner {
  padding: 16px 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 4px;
}

.sidebar-title {
  color: rgba(255,255,255,.85);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0;
  white-space: nowrap;
}

.sidebar-toggle {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .25s ease;
  flex-shrink: 0;
}
.sidebar-toggle:hover {
  background: rgba(255,255,255,.15);
  color: #fff;
}

/* ── Menu links ── */
.sidebar-menu {
  flex-grow: 1;
  gap: 2px;
}

.sidebar-nav .nav-link {
  color: rgba(255,255,255,.7);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all .25s ease;
  white-space: nowrap;
}

.sidebar-nav .nav-link i {
  font-size: 1.15rem;
  width: 22px;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-nav.collapsed .nav-link span,
.sidebar-nav.collapsed .sidebar-title,
.sidebar-nav.collapsed .dropdown-toggle::after {
  display: none;
}

.sidebar-nav .nav-link:hover {
  background: rgba(255,255,255,.08);
  color: #fff;
}

.sidebar-nav .router-link-exact-active {
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(67,97,238,.3);
}

/* Dropdown */
.sidebar-nav .dropdown-menu {
  background: #2d2d44;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;
  padding: 6px;
}
.sidebar-nav .dropdown-item {
  color: rgba(255,255,255,.75);
  border-radius: 8px;
  font-size: 0.82rem;
  padding: 8px 12px;
}
.sidebar-nav .dropdown-item:hover {
  background: rgba(255,255,255,.1);
  color: #fff;
}

/* ── Main content ── */
.main-content {
  background: #f0f2f5;
  overflow-y: auto;
  min-width: 0;
}

.content-wrapper {
  padding: 28px;
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>