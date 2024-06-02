<script setup lang="ts">
import { useAction } from '../../composables/useAction'
import Error from '../elements/Error.vue'
import Spinner from './Spinner.vue'
import { type Ref, ref } from '#imports'

defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<{
  label?: string
  color?: 'default' | 'primary' | 'positive' | 'negative' | 'contrast'
  icon?: string
  click?: (e?: Event) => any
  disabled?: boolean
  mini?: boolean
  flat?: boolean
}>(), {
  color: 'default',
})

const emit = defineEmits(['click'])
const el = ref() as Ref<HTMLElement>

const { pending, action, shake, error } = useAction(async (e: Event) => {
  e.stopPropagation()
  e.preventDefault()
  if (props.disabled)
    return
  if (props.click)
    await props.click(e)
  emit('click', e)
})
</script>

<template>
  <div
    class="dialog:my-0"
    :class="{ 'w-full dialog:px-2': !mini }"
  >
    <Error v-if="error" :error />
    <button
      ref="el"
      class="max-h-full min-h-11 w-full rounded-xl font-500 desktop:min-h-10"
      :color
      :disabled="disabled || pending"
      :class="{ clickable: !disabled, mini, flat, shake }"
      @[$click]="action"
    >
      <div v-if="pending">
        <Spinner :size="mini ? '20' : '24'" />
      </div>
      <div v-else class="flex items-center justify-center gap-2">
        <Icon v-if="icon" :name="icon" />
        <div v-if="label">
          {{ label }}
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>
.mini {
  --uno: w-10;
}
.flat {
  --uno: bg-transparent;
}
</style>
