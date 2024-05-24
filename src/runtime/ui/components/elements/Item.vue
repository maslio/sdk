<script setup lang="ts">
import { type PageProps, type PageTarget, usePage } from '../../composables/usePage'
import Checkbox from './Checkbox.vue'
import { type Ref, computed, ref, useSlots } from '#imports'

export interface Props {
  icon?: string
  iconClass?: string
  iconSize?: string
  label?: string
  labelClass?: string | string[]
  caption?: string
  captionFirst?: boolean
  captionClass?: string | string[]
  value?: string
  valueClass?: string | string[]
  clickable?: boolean
  page?: PageProps | PageTarget
  href?: string
  option?: boolean
  selected?: boolean
  noTruncate?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: '24',
})
const emit = defineEmits(['click'])
defineSlots<{
  page: (props: {
    close: () => void
  }) => any
  left: () => any
  main: () => any
  right: () => any
}>()
// console.log(props.label)
const el = ref() as Ref<HTMLElement>
const slots = useSlots()

const page = slots.page ? usePage(props.page, props.label) : null

async function onClick(e: Event) {
  if (props.disabled)
    return
  emit('click', e)
  if (props.option)
    return
  if (page)
    page.open()
}
// const icon = computed(() => {
//   if (!props.icon)
//     return null
//   const [name, ..._class] = props.icon.split(' ')
//   return { name, class: _class }
// })
const tag = props.href ? 'a' : 'div'
const clickable = computed(() => {
  return props.clickable || props.option || props.href || page
})
</script>

<template>
  <component
    :is="tag"
    class="block min-h-11 w-full overflow-hidden rounded-xl text-left desktop:min-h-10 card:rounded-none"
    color="default"
    :class="{ clickable, opened: page?.opened.value }"
    :href="href"
    v-bind="$attrs"
    @[$click]="onClick"
  >
    <div
      ref="el"
      class="relative min-h-11 flex items-center gap-3 px-3 py-3 desktop:min-h-10 desktop:py-2"
    >
      <div v-if="option">
        <Checkbox :selected />
      </div>
      <slot v-if="$slots.left" name="left" />
      <div v-else-if="$props.icon" class="h-6 w-6 flex items-center justify-center rounded desktop:(h-5 w-5)">
        <Icon
          v-if="icon" :name="icon"
          :class="iconClass"
          rounded p-2px
          :size="iconSize"
        />
      </div>
      <div v-if="$slots.main" class="flex-1">
        <slot v-if="$slots.main" name="main" />
      </div>
      <div
        v-else
        class="flex flex-1 flex-basis-2xl flex-col flex-nowrap overflow-hidden"
        :class="captionFirst ? 'flex-col-reverse' : 'flex-col'"
      >
        <div v-if="$props.label" class="text-base" :class="$props.labelClass">
          {{ label }}
        </div>
        <div v-if="$props.caption" class="text-sm text-faint" :class="$props.captionClass">
          {{ caption }}
        </div>
      </div>

      <slot v-if="$slots.right" name="right" />
      <div v-else-if="$props.value" class="max-w-50% truncate text-right text-sm text-faint" :class="$props.valueClass">
        {{ value }}
      </div>

      <Icon
        v-if="href"
        name="material-symbols-light:open-in-new-rounded" size="18"
        class="ml--3 mr--1 transition-color text-faint"
      />
      <div
        v-else-if="page"
        class="ml--3 mr--1 flex items-center"
      >
        <Spinner
          v-if="page.target.value?.pending"
          class="ml-0.5 mr--0.5" size="18"
        />
        <Icon
          v-else
          name="fluent:chevron-right-16-filled" size="18"
          class="transition-color text-faint"
        />
      </div>
    </div>
  </component>
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
</template>
