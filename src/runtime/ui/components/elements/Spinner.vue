<script setup lang="ts">
defineProps<{
  size?: string
}>()
</script>

<template>
  <Icon name="spinner" animate-spin :size />
</template>
