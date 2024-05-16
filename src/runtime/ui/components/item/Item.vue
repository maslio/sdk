<script setup lang="ts">
import Open, { type Props as OpenProps, type Target } from '../open/Open.vue'

const props = withDefaults(defineProps<{
  icon?: string
  label?: string
  caption?: string | number
  value?: string | number
  clickable?: boolean
  open?: Target | OpenProps
  href?: string
  option?: boolean
  selected?: boolean
  noTruncate?: boolean
  disabled?: boolean
}>(), {
  open: 'next',
})
const emit = defineEmits(['click'])
defineSlots<{
  default: (props: {
    close: () => void
  }) => any
  left: () => any
  main: () => any
  right: () => any
}>()
// console.log(props.label)
const el = ref() as Ref<HTMLElement>
const slots = useSlots()

const opened = ref(false)
const hasOpen = slots.default != null || typeof props.open === 'object'
const renderOpen = ref(import.meta.dev && hasOpen)
const open = ref<null | InstanceType<typeof Open>>(null)
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

async function onClick(e: Event) {
  if (props.disabled)
    return
  emit('click', e)
  if (props.option)
    return
  if (hasOpen) {
    if (!renderOpen.value) {
      renderOpen.value = true
      await nextTick()
    }
    open.value?.open()
  }
}
const icon = computed(() => {
  if (!props.icon)
    return null
  const [name, ..._class] = props.icon.split(' ')
  return { name, class: _class }
})
function close() {
  open.value?.close()
}
// const tag = props.href ? 'a' : hasOpen ? 'button' : 'div'
const tag = props.href ? 'a' : 'div'
const clickable = computed(() => {
  return props.clickable || props.option || props.href || hasOpen
})
</script>

<template>
  <component
    :is="tag"
    class="block min-h-11 w-full overflow-hidden rounded-xl text-left desktop:min-h-10 card:rounded-none"
    color="default"
    :class="{ clickable, selected: opened }"
    :href="href"
    v-bind="$attrs"
    @click="onClick"
  >
    <div
      ref="el"
      class="relative min-h-11 flex items-center gap-3 px-3 py-3 desktop:min-h-10 desktop:py-2"
    >
      <div v-if="option">
        <InputOptionDot :active="selected" />
      </div>
      <slot v-if="$slots.left" name="left" />
      <div v-else-if="$props.icon" class="h-6 w-6 flex items-center justify-center rounded desktop:(h-5 w-5)">
        <Icon
          v-if="icon" :name="icon.name"
          :class="icon.class"
          rounded p-2px
          size="24"
        />
      </div>
      <div v-if="$slots.main" class="flex-1">
        <slot v-if="$slots.main" name="main" />
      </div>
      <div v-else class="flex-1 flex-basis-2xl flex-nowrap overflow-hidden">
        <div v-if="$props.label" class="text-base" :class="{ truncate: !noTruncate }">
          {{ label }}
        </div>
        <div v-if="$props.caption" class="text-sm text-faint" :class="{ truncate: !noTruncate }">
          {{ caption }}
        </div>
      </div>

      <slot v-if="$slots.right" name="right" />
      <div v-else-if="$props.value" class="max-w-50% truncate text-right text-sm text-faint">
        {{ value }}
      </div>

      <Icon
        v-if="href"
        name="material-symbols-light:open-in-new-rounded" size="18"
        class="ml--3 mr--1 transition-color text-faint"
      />
      <Icon
        v-else-if="hasOpen"
        name="fluent:chevron-right-16-filled" size="18"
        class="ml--3 mr--1 transition-color text-faint"
      />
    </div>
  </component>
  <Open
    v-if="renderOpen"
    ref="open"
    v-bind="openProps"
    v-model="opened"
    :parent="el"
  >
    <slot :close />
  </Open>
</template>
