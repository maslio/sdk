<script setup lang="ts">
import { useFluent } from 'fluent-vue'
import { addDays, subDays } from 'date-fns'
import Item from '../elements/Item.vue'
import Open from '../open/Open.vue'
import { formatDate } from '../../../base/utils/date'
import { openRef } from '../../utils/open'
import DateCalendar from './DateCalendar.vue'
import DateInput from './DateInput.vue'
import Select from './Select.vue'
import { type Ref, computed, useNuxtApp } from '#imports'

const props = defineProps<{
  label?: string
  readonly?: boolean
}>()

const { $t } = useFluent()
const locale = useNuxtApp().$locale as Ref<string>
const label = computed(() => props.label ?? $t('date'))
const open = openRef()
const { format: formatPresetDate } = new Intl.DateTimeFormat(locale.value, {
  month: 'long',
  year: 'numeric',
  day: 'numeric',
})

const model = defineModel<string>({
  default: formatDate(new Date()),
})
function onCalendarSelect(value: string) {
  model.value = value
}

const presets = [{
  value: formatDate(subDays(new Date(), 1)),
  item: {
    label: $t('date_day_prev'),
    value: formatPresetDate(subDays(new Date(), 1)),
  },
}, {
  value: formatDate(new Date()),
  item: {
    label: $t('date_day_this'),
    value: formatPresetDate(new Date()),
  },
}, {
  value: formatDate(addDays(new Date(), 1)),
  item: {
    label: $t('date_day_next'),
    value: formatPresetDate(addDays(new Date(), 1)),
  },
}]

const value = computed(() => {
  const preset = presets.find(p => p.value === model.value)
  if (preset)
    return preset.item.label
  return formatPresetDate(new Date(model.value))
})
</script>

<template>
  <Item
    :label
    :value
    :disabled="readonly"
    open :opened="open?.opened()"
    @click="open.open()"
  />
  <Open ref="open" :label>
    <DateInput v-model="model" />
    <Select v-model="model" :options="presets" />
    <DateCalendar :selected="[model]" @select="onCalendarSelect" />
  </Open>
</template>
