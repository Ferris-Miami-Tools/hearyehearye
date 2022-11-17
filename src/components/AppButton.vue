<script setup>
  const props = defineProps({
    variant: {
      type: String,
      default: "primary",
    },
    fn: {
      type: Function,
      default: () => null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    pill: {
      type: Boolean,
      default: false,
    }
  });
</script>

<template>
  <button
    :disabled="disabled"
    @click="() => fn()"
    :class="`py-2 px-4 flex items-center justify-center text-xs sm:text-sm focus:outline-none ${pill ? 'rounded-full': 'rounded-2xl'} ${variant == 'primary' ? 'w-full text-white bg-emerald-500 enabled:hover:bg-emerald-600' : variant == 'google' ? 'w-full text-white bg-red-500 enabled:hover:bg-red-600' : 'border text-red-600 border-red-600 enabled:hover:bg-red-50'} disabled:opacity-25 disabled:cursor-not-allowed`"
  >
    <slot />
  </button>
</template>
