<script setup lang="ts">
import type { Placement } from '@floating-ui/vue'
import delay from 'delay'
import { defu } from 'defu'
import type { Props as OpenProps, Target } from './Open.vue'

defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<{
  label?: string
  color?: 'default' | 'primary' | 'positive' | 'negative' | 'contrast'
  icon?: string
  action?: () => Promise<() => void> | Promise<void>
  actionDelay?: number
  disabled?: boolean
  mini?: boolean
  flat?: boolean
  open?: Target | OpenProps
}>(), {
  color: 'default',
  actionDelay: 500,
  open: 'dialog',
})

const emit = defineEmits(['click'])

defineSlots<{
  default: (props: {
    close: () => void
  }) => any
}>()

const el = ref() as Ref<HTMLElement>
const slots = useSlots()

const selected = ref(false)
const hasOpen = slots.default != null || typeof props.open === 'object'
const renderOpen = ref(false)
const open = ref<null | InstanceType<typeof import('./Open.vue').default>>(null)
function close() {
  open.value?.close()
}
const openProps = computed(() => {
  if (typeof props.open === 'string') {
    return {
      target: props.open,
      label: props.label,
    }
  }
  return {
    target: props.open.target,
    label: props.open.label ?? props.label,
    width: props.open.width,
    header: props.open.header,
    placement: props.open.placement,
    component: props.open.component,
    props: props.open.props,
  }
})

const pending = ref(false)
const isDisabled = computed(() => props.disabled || pending.value)
async function onClick(e: Event) {
  if (isDisabled.value)
    return
  e.stopPropagation()
  e.preventDefault()
  emit('click', e)
  if (hasOpen) {
    if (!renderOpen.value) {
      renderOpen.value = true
      await nextTick()
    }
    open.value?.open()
    return
  }
  if (props.action == null)
    return
  pending.value = true
  const result = await delay(props.actionDelay, { value: props.action() })
  pending.value = false
  if (typeof result === 'function')
    result()
}
</script>

<template>
  <div
    class="dialog:my-0"
    :class="{ 'w-full dialog:px-2': !mini }"
  >
    <button
      ref="el"
      class="max-h-full min-h-11 w-full rounded-xl font-500 desktop:min-h-10"
      :color
      :disabled="isDisabled"
      :class="{ clickable: !isDisabled, mini, flat, selected }"
      @click="onClick"
    >
      <div v-if="pending">
        <Icon name="mingcute:loading-3-line" :size="mini ? '20' : '24'" animate-spin />
      </div>
      <div v-else class="flex items-center justify-center gap-2">
        <Icon v-if="icon" :name="icon" />
        <div v-if="label">
          {{ label }}
        </div>
      </div>
    </button>
    <Open
      v-if="renderOpen"
      ref="open"
      v-bind="openProps"
      v-model="selected"
      :parent="el"
    >
      <slot :close />
    </Open>
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
