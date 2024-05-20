<script setup lang="ts">
import { useAction } from '../../composables/useAction'
import ItemButton from '../elements/ItemButton.vue'
import Spinner from '../elements/Spinner.vue'
import Error from '../elements/Error.vue'
import InputText from './InputText.vue'
import { ref } from '#imports'

const props = withDefaults(defineProps<{
  send?: (text: string) => any
  rows?: number
  disabled?: boolean
  minLength?: number
  placeholder?: string
}>(), {
  rows: 1,
  minLength: 1,
  placeholder: 'Message',
})
const emit = defineEmits(['send'])
const model = defineModel<string>({ default: '' })
const disabled = ref(false)

const { pending, error, action, shake } = useAction(async () => {
  const text = model.value.trim()
  if (!text.length)
    return
  if (text.length < props.minLength)
    throw new Error(`${props.minLength} characters required`)
  emit('send', text)
  if (props.send)
    await props.send(text)
  model.value = ''
})
</script>

<template>
  <Error v-if="error" :error />
  <InputText
    v-model="model"
    flat :class="{ shake }"
    :placeholder :disabled="disabled || pending"
    enterkeyhint="send"
    @keydown.enter.exact.prevent="action"
    @keydown="error = ''"
  >
    <Spinner v-if="pending" />
    <template v-else>
      <ItemButton icon="send" @click="action" />
    </template>
  </InputText>
</template>
