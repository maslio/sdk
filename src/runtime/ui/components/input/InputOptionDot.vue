<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <div
    class="h-3 w-3 rounded-full p-0.5"
    color="neutral"
  >
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="scale-0"
    >
      <div
        v-if="active"
        h-2 w-2 rounded-full
        color="positive"
      />
    </Transition>
  </div>
</template>
