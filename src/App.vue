<template>
  <div id="app">
    <RouterView />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import ToastContainer from "@/components/ui/ToastContainer.vue";
</script>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
