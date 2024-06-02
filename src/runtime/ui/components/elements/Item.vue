<script setup lang="ts">
import Checkbox from './Checkbox.vue'
import { type Ref, computed, ref } from '#imports'

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
  href?: string
  option?: boolean
  selected?: boolean
  noTruncate?: boolean
  disabled?: boolean
  open?: boolean
  opened?: boolean
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

const el = ref() as Ref<HTMLElement>

async function onClick(e: Event) {
  if (props.disabled)
    return
  emit('click', e)
}
const tag = props.href ? 'a' : 'div'
const clickable = computed(() => {
  return props.clickable || props.option || props.href || props.open
})
</script>

<template>
  <component
    :is="tag"
    class="block min-h-11 w-full overflow-hidden rounded-xl text-left desktop:min-h-10 card:rounded-none"
    color="default"
    :class="{ clickable, opened }"
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
      <Icon
        v-else-if="open"
        name="fluent:chevron-right-16-filled" size="18"
        class="ml--3 mr--1 transition-color text-faint"
      />
    </div>
  </component>
</template>
