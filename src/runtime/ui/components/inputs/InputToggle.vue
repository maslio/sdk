<script setup lang="ts">
import Input from './Input.vue'

const { readonly } = defineProps<{
  label: string
  readonly?: boolean
}>()
const model = defineModel<boolean>()
function toggle() {
  if (readonly)
    return
  model.value = !model.value
}
</script>

<template>
  <Input :clickable="!readonly" :label @click="toggle">
    <template #right>
      <ClientOnly>
        <div
          h-24px w-40px
          rounded-full p-3px
          transition duration-200
          ease-in-out
          :color="model ? 'positive' : 'neutral'"
        >
          <div
            h-18px w-18px
            translate-x-0 transform
            rounded-full transition
            duration-200 ease-in-out
            light="bg-white"
            dark="bg-dark"
            :class="{ 'translate-x-4': model }"
          />
        </div>
      </ClientOnly>
    </template>
  </Input>
</template>
