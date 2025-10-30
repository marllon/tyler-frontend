<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader v-if="isAuthenticated" />
    <main :class="isAuthenticated ? 'ml-64 p-8' : ''">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import AdminHeader from "@/components/admin/AdminHeader.vue";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>
