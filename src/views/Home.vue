<script setup>
  import store from "../store";
  import AppButton from "../components/AppButton.vue";
</script>

<template>
  <div class="flex-1 w-full flex justify-center items-center">
    <div class="px-4 sm:px-6 md:px-8 lg:px-10 py-6 w-50 max-w-sm flex flex-col bg-white shadow-md rounded-3xl">
      <div class="pb-4 relative flex items-center">
        <div class="flex-grow border-t border-gray-400"></div>
        <span class="mx-4 flex-shrink text-gray-400">Miami Login</span>
        <div class="flex-grow border-t border-gray-400"></div>
      </div>

      <app-button
        :disabled="store.state.authenticating"
        :fn="store.actions.loginG"
        variant="google"
      >
        <span class="mr-2 uppercase">Google Log In</span>
        <span>
          <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </span>
      </app-button>

      <div class="py-4 relative flex items-center">
        <div class="flex-grow border-t border-gray-400"></div>
        <span class="mx-4 flex-shrink text-gray-400">Judge Login</span>
        <div class="flex-grow border-t border-gray-400"></div>
      </div>

      <form @submit.prevent="() => store.actions.loginEP()">
        <!-- Email -->
        <label for="email" class="mb-1 text-xs tracking-wide text-gray-600">Email Address</label>
        <div class="relative">
          <div class="absolute left-0 top-0 inline-flex items-center justify-center h-full w-10 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input v-model="store.state.email" required type="email" autocomplete="email" id="email" name="email" placeholder="Enter your email" class="pl-10 pr-4 py-2 text-sm placeholder-gray-500 rounded-2xl border border-gray-400 w-full focus:outline-none focus:border-blue-400">
        </div>
        <!-- Password -->
        <label for="password" class="mb-1 text-xs tracking-wide text-gray-600">Password</label>
        <div class="relative">
          <div class="absolute left-0 top-0 inline-flex items-center justify-center h-full w-10 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <input v-model="store.state.password" required type="password" autocomplete="current-password" id="password" name="password" placeholder="Enter your password" class="pl-10 pr-4 py-2 text-sm placeholder-gray-500 rounded-2xl border border-gray-400 w-full focus:outline-none focus:border-blue-400">
        </div>
        <!-- Log In Button -->
        <div class="mt-3 flex w-full">
          <app-button
            :disabled="store.state.authenticating"
          >
            <span class="mr-2 uppercase">Judge Log In</span>
            <span>
              <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </app-button>
        </div>
      </form>
    </div>
  </div>
</template>
