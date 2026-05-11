<template>
  <div>
    <h1>Journal des actions</h1>

    <div class="card mt-4">
      <div class="card-header bg-dark text-white">
        Historique des actions
      </div>

      <table class="table table-bordered mb-0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Utilisateur</th>
            <th>Rôle</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="log in logs" :key="log.idlog">
            <td>{{ formatDate(log.temps) }}</td>
            <td>{{ log.nomuser }} {{ log.prenuser }}</td>
            <td>{{ log.roleuser }}</td>
            <td>{{ log.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";

const logs = ref([]);

const loadLogs = async () => {
  const res = await api.get("/journallog");
  logs.value = res.data;
};

onMounted(loadLogs);

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString("fr-FR");
};
</script>
<style scoped>
h1 {
  color: #0d6efd;
  font-weight: bold;
}
</style>