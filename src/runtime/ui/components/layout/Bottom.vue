<script setup lang="ts">
const { bottomEl } = useLayout()
</script>

<template>
  <Teleport v-if="bottomEl" :to="bottomEl">
    <slot />
  </Teleport>
</template>
