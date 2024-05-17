<script setup lang="ts">
import Input from './Input.vue'
import { type Ref, ref, useFocus, watch } from '#imports'

defineOptions({
  inheritAttrs: false,
})
withDefaults(defineProps<{
  placeholder?: string
  autofocus?: boolean
  disabled?: boolean
  readonly?: boolean
  flat?: boolean
  label?: string
  type?: 'text' | 'email'
}>(), {
  type: 'text',
})
const emit = defineEmits(['focus', 'blur'])
defineSlots<{
  default: () => void
}>()
const input = ref() as Ref<HTMLInputElement>
const model = defineModel<string>()
const { focused } = useFocus(input)
watch(focused, (value) => {
  if (value)
    emit('focus')
  else
    emit('blur')
})
function onClick() {
  input.value.focus()
}
</script>

<template>
  <Input
    :focused :readonly
    :flat :label
    @click="onClick"
  >
    <input
      ref="input"
      v-bind="$attrs" v-model="model"
      :placeholder :type
      :autofocus :readonly
      class="min-h-6 w-full flex-1 appearance-none bg-transparent outline-none"
      :class="{ 'text-faint': disabled }"
    >
    <template v-if="$slots.default" #right>
      <slot />
    </template>
  </Input>
</template>
