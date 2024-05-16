<script setup lang="ts">
defineProps<{
  size?: string
}>()
</script>

<template>
  <IconCSS name="spinner" animate-spin :size />
</template>
