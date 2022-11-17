<script setup>
  import store from "./store";
  import AppButton from "./components/AppButton.vue";
</script>

<template>
  <div class="px-4 min-h-screen flex flex-col bg-gray-200">
    <nav class="py-2 w-full flex flex-row justify-between items-center">
      <router-link to="/" class="text-2xl sm:text-3xl">
        Hear<span class="text-emerald-600">Ye</span>Hear<span class="text-emerald-600">Ye</span>
      </router-link>

      <app-button
        v-if="store.state.user"
        variant="error"
        :disabled="store.state.authenticating"
        :fn="store.actions.logout"
        :pill="true"
      >Log Out</app-button>
    </nav>
    <main class="py-6 flex-1 flex">
      <router-view />
    </main>
    <footer class="py-2 text-sm text-gray-600 text-center">
      Made with 💜 and Honor by <a class="text-emerald-600 hover:text-emerald-700" href="https://jajjferris.com" target="_blank" rel="noopener nofollow">Joshua Ferris</a>
    </footer>
  </div>
</template>
