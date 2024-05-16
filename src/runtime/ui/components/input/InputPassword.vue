<script setup lang="ts">
defineProps<{
  placeholder?: string
  autofocus?: boolean
  readonly?: boolean
  flat?: boolean
}>()
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
    :flat
    @click="onClick"
  >
    <input
      ref="input" v-model="model"
      type="password" :placeholder
      :autofocus :readonly
      class="min-h-6 w-full flex-1 appearance-none bg-transparent outline-none"
    >
    <template v-if="$slots.default" #right>
      <slot />
    </template>
  </Input>
</template>
