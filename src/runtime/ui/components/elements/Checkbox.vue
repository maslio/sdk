<script setup lang="ts">
defineProps<{
  selected?: boolean
}>()
</script>

<template>
  <div
    class="relative h-4 w-4 rounded-md"
    transition duration-100
    ease-out
    :color="selected ? 'primary' : 'neutral'"
  >
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="scale-0"
    >
      <Icon
        v-if="selected"
        class="absolute left--3px top--3px"
        name="material-symbols:check-small-rounded"
        size="22"
      />
    </Transition>
  </div>
</template>
