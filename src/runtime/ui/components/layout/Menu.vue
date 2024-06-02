<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'
import Open from '../open/Open.vue'
import Button from '../elements/Button.vue'
import { openRef } from '../../utils/open'

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
const open = openRef()
const { menuEl } = useLayout()
function close() {
  open.value.close()
}
function onClick(e: Event) {
  emit('click', e)
  open.value.open()
}
</script>

<template>
  <Teleport v-if="menuEl" :to="menuEl">
    <Button
      flat mini
      :icon
      :page="{ target: 'top', label, header: !!label }"
      @click="onClick"
    />
  </Teleport>
  <Open ref="open" target="top">
    <slot :close />
  </Open>
</template>
