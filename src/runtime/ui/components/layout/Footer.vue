<script setup lang="ts">
const { footerEl } = useLayout()
</script>

<template>
  <Teleport v-if="footerEl" :to="footerEl">
    <slot />
  </Teleport>
</template>
