<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})
withDefaults(defineProps<{
  placeholder?: string
  autofocus?: boolean
  disabled?: boolean
  readonly?: boolean
  flat?: boolean
  class?: any
  rows?: number
}>(), {
  rows: 1,
})
const emit = defineEmits(['focus', 'blur'])
defineSlots<{
  default: () => void
}>()
const model = defineModel<string>()
const { textarea } = useTextareaAutosize({
  input: model,
  styleProp: 'minHeight',
})
const { focused } = useFocus(textarea)
watch(focused, (value) => {
  if (value)
    emit('focus')
  else
    emit('blur')
})
</script>

<template>
  <Input
    :focused :readonly
    :flat
    :class="$props.class"
  >
    <textarea
      ref="textarea"
      v-bind="$attrs" v-model="model"
      :placeholder
      :autofocus :readonly
      class="w-full resize-none appearance-none bg-transparent outline-none"
      :rows
      :class="{ 'text-faint': disabled }"
    />
    <template v-if="$slots.default" #right>
      <slot />
    </template>
  </Input>
</template>
