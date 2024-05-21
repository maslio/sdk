<script setup lang="ts">
import { useAction } from '../../composables/useAction'
import { type PageProps, type PageTarget, usePage } from '../../composables/usePage'
import Error from '../elements/Error.vue'
import Spinner from './Spinner.vue'
import { type Ref, ref, useSlots } from '#imports'

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
  page?: PageProps | PageTarget
}>(), {
  color: 'default',
  page: 'center',
})

const emit = defineEmits(['click'])

defineSlots<{
  page: (props: {
    close: () => void
  }) => any
}>()

const el = ref() as Ref<HTMLElement>
const slots = useSlots()

const page = slots.page ? usePage(props.page, props.label) : null

const { pending, action, shake, error } = useAction(async (e: Event) => {
  if (props.disabled)
    return
  e.stopPropagation()
  e.preventDefault()
  emit('click', e)
  if (props.click)
    return await props.click(e)
  if (page)
    return page.open()
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
      :class="{ clickable: !disabled, mini, flat, opened: page?.opened.value, shake }"
      @click="action"
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
    <template v-if="page">
      <component
        :is="page.component"
        :ref="page.target"
        v-bind="page.props"
        :parent="el"
      >
        <slot name="page" :close="page.close" />
      </component>
    </template>
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
