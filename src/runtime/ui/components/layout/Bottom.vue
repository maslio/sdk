<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'

const { bottomEl } = useLayout()
</script>

<template>
  <Teleport v-if="bottomEl" :to="bottomEl">
    <div v-bind="$attrs">
      <slot />
    </div>
  </Teleport>
</template>
