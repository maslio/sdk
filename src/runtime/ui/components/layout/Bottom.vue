<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'

const { bottomEl } = useLayout()
</script>

<template>
  <Teleport v-if="bottomEl" :to="bottomEl">
    <slot />
  </Teleport>
</template>
