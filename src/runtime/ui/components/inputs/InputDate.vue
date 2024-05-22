<script setup lang="ts">
import { useFluent } from 'fluent-vue'
import { addDays, subDays } from 'date-fns'
import Card from '../elements/Card.vue'
import Item from '../elements/Item.vue'
import { formatDate } from '../../../base/utils/date'
import DateCalendar from './DateCalendar.vue'
import InputDateInput from './InputDateInput.vue'
import Select from './Select.vue'
import { type Ref, computed, useNuxtApp } from '#imports'

defineProps<{
  label?: string
  readonly?: boolean
}>()

const { $t } = useFluent()
const locale = useNuxtApp().$locale as Ref<string>
const { format: formatPresetDate } = new Intl.DateTimeFormat(locale.value, {
  month: 'long',
  year: 'numeric',
  day: 'numeric',
})

const model = defineModel<string>({
  default: new Date().toISOString().split('T')[0],
})
function onCalendarSelect(value: string) {
  model.value = value
}

const presets = [{
  value: formatDate(subDays(new Date(), 1)),
  item: {
    label: $t('date_day_prev'),
    value: formatPresetDate(subDays(new Date(), 1)),
    valueClass: 'font-mono',
  },
}, {
  value: formatDate(new Date()),
  item: {
    label: $t('date_day_this'),
    value: formatPresetDate(new Date()),
    valueClass: 'font-mono',
  },
}, {
  value: formatDate(addDays(new Date(), 1)),
  item: {
    label: $t('date_day_next'),
    value: formatPresetDate(addDays(new Date(), 1)),
    valueClass: 'font-mono',
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
  <Item :label="label ?? $t('date')" :value :disabled="readonly">
    <template v-if="!readonly" #page>
      <Card>
        <div class="px-3 py-2 text-center">
          <label text-faint>{{ $t('input') }}</label>
          <InputDateInput v-model="model" />
        </div>
      </Card>
      <Select v-model="model" :options="presets" />
      <DateCalendar :selected="[model]" @select="onCalendarSelect" />
      <!-- <InputDateCalendar :selected="[model]" @select="onCalendarSelect" /> -->
    </template>
  </Item>
</template>
