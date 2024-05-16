<script setup lang="ts">
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
      v-slot="{ close }"
      flat mini
      :icon
      :open="{ target: 'dialog', label, header: !!label }"
      @click="emit('click', $event)"
    >
      <slot :close />
    </Button>
  </Teleport>
</template>
