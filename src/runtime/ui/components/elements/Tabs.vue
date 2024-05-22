<script setup lang="ts">
interface Tab {
  value: string
  label: string
}

defineProps<{
  tabs: Tab[]
}>()

const model = defineModel<string>()
</script>

<template>
  <div
    color="default"
    class="relative rounded-xl px-2 py-2 card:rounded-none"
  >
    <div class="w-full flex gap-0.5">
      <div
        v-for="tab in tabs" :key="tab.value"
        color="default"
        class="flex flex-1 items-center justify-center"
      >
        <div
          color="default"
          class="clickable min-h-8 w-full flex items-center justify-center rounded-lg"
          :class="{ opened: model === tab.value }"
          @click="model = tab.value"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>
  </div>
</template>
