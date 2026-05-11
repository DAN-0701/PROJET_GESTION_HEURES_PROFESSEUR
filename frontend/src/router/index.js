import { createRouter, createWebHistory } from "vue-router";
import api from "../services/api";

// pages principales
import Login from "../views/login.vue";
import Admin from "../views/admin.vue";
import Ressource from "../views/ressource.vue";
import Professeur from "../views/professeur.vue";
import UpdatePassword from "../views/updatepassword.vue";
// pages enfants admin
import GestionAdmin from "../views/gestionadmin.vue";
import GestionRh from "../views/gestionrh.vue";
import GestionProf from "../views/gestionprof.vue";
import thoraire from "../views/thoraire.vue";
import gestionmatiere from "../views/gestionmatiere.vue";
import gestionannee from "../views/gestanne.vue";
import Affectation from "../views/affectation.vue";
import journallog from "../views/journallog.vue";
import Dashbordadmin from "../views/dashbordadmin.vue";
import parametrage from "../views/parametrage.vue";
//PAGES ENFANTS RH
import saisie_valheure from "../views/saisie_valheure.vue";
import Consulstat from "../views/consulstat.vue";
import genpayement from "../views/genpayement.vue";
import heuredepasse from "../views/heuredepasse.vue";
import Dashbordrh from "../views/dashbordrh.vue";

//page enfants prof
import Consultheure from "../views/consultheure.vue";
import statprof from "../views/statprof.vue";
import Dashbordprof from "../views/dashbordprof.vue";
const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  //mise a jour mot de passe
  {
    path: "/updatepassword",
    name: "updatepassword",
    component: UpdatePassword,
  },
  // ================= ADMIN =================
  {
    path: "/admin",
    component: Admin,
    meta:{requiresAuth:true},
    children: [
      {
        path:"dashbordadmin",
        name:"dashbordadmin",
        component:Dashbordadmin,
        meta:{requiresAuth:true},
      },
      {
        path: "gestionadmin",
        name: "gestionadmin",
        component: GestionAdmin,
        meta:{requiresAuth:true},
      },
      {
        path: "gestionrh",
        name: "gestionrh",
        component: GestionRh,
        meta:{requiresAuth:true},
      },
      {
        path: "gestionprof",
        name: "gestionprof",
        component: GestionProf,
        meta:{requiresAuth:true},
      },
      {
        path: "thoraire",
        name: "thoraire",
        component: thoraire,
        meta:{requiresAuth:true},
      },
      {
        path: "gestionmatiere",
        name: "gestionmatiere",
        component: gestionmatiere,
        meta:{requiresAuth:true},
      },
      {
        path: "gestionannee",
        name: "gestionannee",
        component: gestionannee,
        meta:{requiresAuth:true},
      },
      {
        path:"affectation",
        name:"affectation",
        component:Affectation,
        meta:{requiresAuth:true},
      },
      {
        path: "journallog",
        name: "journallog",
        component: journallog,
        meta:{requiresAuth:true},
      },
      {
        path: "parametrage",
        name: "parametrage",
        component: parametrage,
        meta:{requiresAuth:true},
      }
    ],
  },

  // ================= RH =================
  {
    path: "/ressource",
    name: "ressource",
    component: Ressource,
    meta:{requiresAuth:true},
    children:[
        {
        path:"dashbordrh",
        name:"dashbordrh",
        component:Dashbordrh,
        meta:{requiresAuth:true},
      },
      {
        path:"saisie_valheure",
        name:"saisie_valheure",
        component:saisie_valheure,
        meta:{requiresAuth:true},
      },
      {
        path:"consulstat",
        name:"consulstat",
        component:Consulstat,
        meta:{requiresAuth:true},
      },
      {
        path:"genpayement",
        name:"genpayement",
        component:genpayement,
        meta:{requiresAuth:true},
      },
      {
        path:"heuredepasse",
        name:'heuredepasse',
        component:heuredepasse,
        meta:{requiresAuth:true},
      }
    ]
  },

  // ================= PROF =================
  {
    path: "/professeur",
    name: "professeur",
    component: Professeur,
    meta:{requiresAuth:true},
    children:[
            {
        path:"dashbordprof",
        name:"dashbordprof",
        component:Dashbordprof,
        meta:{requiresAuth:true},
      },
      {
        path:"consultheure",
        name:"consultheure",
        component:Consultheure,
        meta:{requiresAuth:true},
      },
      {
        path:"statprof",
        name:"statprof",
        component:statprof,
        meta:{requiresAuth:true},
      },
]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    try {
      // on vérifie la session côté backend
      await api.get("/auth");

      // ✅ session valide → accès autorisé
      next();
    } catch (error) {
      // ❌ session invalide ou expirée
      next({ name: "login", replace: true });
    }
  } else {
    next();
  }
});

export default router;
