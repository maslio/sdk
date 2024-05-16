<script setup lang="ts">
import type { Props as PlaygroundProps } from './Playground.vue'

interface Props extends PlaygroundProps {
  label?: string
  icon?: string
}
const props = defineProps<Props>()
const label = props.label ?? props.component
const icon = props.icon ?? 'iconamoon:component-fill'
</script>

<template>
  <Item :icon :label font-mono>
    <Playground v-bind="$props" />
  </Item>
</template>
