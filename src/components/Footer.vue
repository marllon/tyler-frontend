<template>
  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-xl font-bold mb-4 text-tyler-blue">Projeto Tyler</h3>
          <p class="text-gray-400 text-sm">
            Apoiando a história de Tyler Lima Eler através de solidariedade,
            esperança e amor.
          </p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="font-semibold mb-4">Navegação</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <RouterLink
                to="/"
                class="text-gray-400 hover:text-white transition-colors"
                >Início</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/products"
                class="text-gray-400 hover:text-white transition-colors"
                >Produtos</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/goals"
                class="text-gray-400 hover:text-white transition-colors"
                >Metas</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/raffles"
                class="text-gray-400 hover:text-white transition-colors"
                >Rifas</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/events"
                class="text-gray-400 hover:text-white transition-colors"
                >Eventos</RouterLink
              >
            </li>
          </ul>
        </div>

        <!-- Info -->
        <div>
          <h4 class="font-semibold mb-4">Informações</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <RouterLink
                to="/about"
                class="text-gray-400 hover:text-white transition-colors"
                >Sobre</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/contact"
                class="text-gray-400 hover:text-white transition-colors"
                >Contato</RouterLink
              >
            </li>
            <li>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors"
                >Transparência</a
              >
            </li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h4 class="font-semibold mb-4">Redes Sociais</h4>
          <div class="flex gap-4">
            <a
              :href="instagramUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-tyler-pink transition-colors"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div
        class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400"
      >
        <p>
          &copy; {{ currentYear }} Projeto Tyler Lima Eler. Todos os direitos
          reservados.
        </p>
        <p class="mt-2">Desenvolvido com ❤️ para fazer a diferença</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";

const currentYear = computed(() => new Date().getFullYear());
const instagramUrl =
  import.meta.env.VITE_INSTAGRAM_URL ||
  "https://www.instagram.com/tylerlimaeler/";
</script>
