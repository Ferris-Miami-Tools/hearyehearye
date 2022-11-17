<script setup>
  const props = defineProps({
    property: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    fn: {
      type: Function,
      required: true,
    },
  });
</script>

<template>
  <div class="w-full grid md:grid-cols-12 gap-4">
    <div class="md:col-span-7">
      <p class="font-medium">{{ prompt }}</p>
      <p class="text-xs italic"><slot /></p>
    </div>
    <div class="md:col-span-5 flex justify-center items-center md:justify-end md:items-start">
      <div class="grid grid-cols-5 rounded-full">
        <button v-for="n in 5" @click="() => fn(property, n)" type="button" class="block cursor-pointer select-none rounded-xl text-center w-10 h-10" :class="value == n ? 'bg-blue-500 font-bold text-white' : ''">
          {{ n }}
        </button>
      </div>
    </div>
  </div>
</template>
