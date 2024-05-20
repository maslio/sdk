<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'
import Button from '../elements/Button.vue'

withDefaults(defineProps<{
  icon?: string
  label?: string
}>(), {
  icon: 'more',
})
const emit = defineEmits(['click'])
defineSlots<{
  default: (props: {
    close: () => void
  }) => any
}>()
const { menuEl } = useLayout()
</script>

<template>
  <Teleport v-if="menuEl" :to="menuEl">
    <Button
      flat mini
      :icon
      :page="{ target: 'top', label, header: !!label }"
      @click="emit('click', $event)"
    >
      <template #page="{ close }">
        <slot :close />
      </template>
    </Button>
  </Teleport>
</template>
