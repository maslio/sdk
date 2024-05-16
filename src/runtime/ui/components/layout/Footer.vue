<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'

const { footerEl } = useLayout()
</script>

<template>
  <Teleport v-if="footerEl" :to="footerEl">
    <slot />
  </Teleport>
</template>
