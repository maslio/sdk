<script setup lang="ts">
defineProps<{
  icon: string
}>()
</script>

<template>
  <button>
    <Icon :name="icon" />
  </button>
</template>
