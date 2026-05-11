<template>
  <div class="vh-100 d-flex flex-column p-0 w-100">
    <dashead>
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-mortarboard-fill" style="font-size:1.1rem"></i>
        ESPACE ENSEIGNANT
      </div>
    </dashead>
    <div class="d-flex flex-grow-1 w-100" style="min-height:0">
      <dasbord class="flex-grow-1">
        <router-view/>
      </dasbord>
    </div>
  </div>
</template>

<script setup>
import dasbord from "../components/dashbordprof.vue";
import dashead from "../components/dashead.vue";
</script>

<style scoped>
</style>