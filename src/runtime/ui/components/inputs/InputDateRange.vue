<script setup lang="ts">
import { useFluent } from 'fluent-vue'
import { addDays, addMonths, addWeeks, endOfMonth, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns'
import Item from '../elements/Item.vue'
import Card from '../elements/Card.vue'
import { formatDate } from '../../../base/utils/date'
import Tabs from '../elements/Tabs.vue'
import Select from './Select.vue'
import DateInput from './DateInput.vue'
import DateCalendar from './DateCalendar.vue'
import { type Ref, computed, ref, useNuxtApp } from '#imports'

defineProps<{
  label?: string
  readonly?: boolean
}>()
const { $t } = useFluent()
const locale = useNuxtApp().$locale as Ref<string>

const model = defineModel<[string, string]>({
  default: [
    formatDate(new Date()),
    formatDate(new Date()),
  ],
})
function rangeToString(range: [string, string]) {
  return `${range[0]} - ${range[1]}`
}
function stringToRange(string: string) {
  return string.split(' - ') as [string, string]
}

const modelString = computed({
  get: () => rangeToString(model.value),
  set: value => model.value = stringToRange(value),
})

const input1 = ref()
const input2 = ref()

const presetsTabs = [{
  label: $t('day'),
  value: 'day',
}, {
  label: $t('week'),
  value: 'week',
}, {
  label: $t('month'),
  value: 'month',
}]
const presetsTab = ref('day')

const presets = (() => {
  interface Preset {
    type: 'day' | 'week' | 'month'
    start: string
    end: string
    label: string
    value: string
  }
  const presets: Preset[] = []

  // day
  const { format: formatPresetDate } = new Intl.DateTimeFormat(locale.value, {
    month: 'long',
    day: 'numeric',
  })
  {
    const date = subDays(new Date(), 1)
    const formated = formatDate(date)
    presets.push({
      type: 'day',
      start: formated,
      end: formated,
      label: $t('date_day_prev'),
      value: formatPresetDate(date),
    })
  }
  {
    const date = new Date()
    const formated = formatDate(date)
    presets.push({
      type: 'day',
      start: formated,
      end: formated,
      label: $t('date_day_this'),
      value: formatPresetDate(date),
    })
  }
  {
    const date = addDays(new Date(), 1)
    const formated = formatDate(date)
    presets.push({
      type: 'day',
      start: formated,
      end: formated,
      label: $t('date_day_next'),
      value: formatPresetDate(date),
    })
  }

  // week
  const formatWeek = new Intl.DateTimeFormat(locale.value, {
    month: 'short',
    day: 'numeric',
  })
  {
    const date = new Date()
    const dateStart = date.getDay() > 0
      ? addDays(subWeeks(startOfWeek(date), 2), 4)
      : addDays(subWeeks(date, 1), 4)
    const dateEnd = addDays(dateStart, 6)
    presets.push({
      type: 'week',
      start: formatDate(dateStart),
      end: formatDate(dateEnd),
      label: $t('date_week_prev'),
      value: formatWeek.formatRange(dateStart, dateEnd),
    })
  }
  {
    const date = new Date()
    const dateStart = date.getDay() > 0
      ? addDays(subWeeks(startOfWeek(date), 1), 4)
      : addDays(date, 4)
    const dateEnd = addDays(dateStart, 6)
    presets.push({
      type: 'week',
      start: formatDate(dateStart),
      end: formatDate(dateEnd),
      label: $t('date_week_this'),
      value: formatWeek.formatRange(dateStart, dateEnd),
    })
  }
  {
    const date = new Date()
    const dateStart = date.getDay() > 0
      ? addDays(startOfWeek(date), 4)
      : addDays(addWeeks(date, 1), 4)
    const dateEnd = addDays(dateStart, 6)
    presets.push({
      type: 'week',
      start: formatDate(dateStart),
      end: formatDate(dateEnd),
      label: $t('date_week_next'),
      value: formatWeek.formatRange(dateStart, dateEnd),
    })
  }

  const formatMonth = new Intl.DateTimeFormat(locale.value, {
    month: 'long',
    year: 'numeric',
  })
  // month
  {
    const date = subMonths(new Date(), 1)
    presets.push({
      type: 'month',
      start: formatDate(startOfMonth(date)),
      end: formatDate(endOfMonth(date)),
      label: $t('date_month_prev'),
      value: formatMonth.format(date),
    })
  }
  {
    const date = new Date()
    presets.push({
      type: 'month',
      start: formatDate(startOfMonth(date)),
      end: formatDate(endOfMonth(date)),
      label: $t('date_month_this'),
      value: formatMonth.format(date),
    })
  }
  {
    const date = addMonths(new Date(), 1)
    presets.push({
      type: 'month',
      start: formatDate(startOfMonth(date)),
      end: formatDate(endOfMonth(date)),
      label: $t('date_month_next'),
      value: formatMonth.format(date),
    })
  }

  return presets
})()

const presetsFiltered = computed(() => {
  return presets
    .filter(p => p.type === presetsTab.value)
    .map(p => ({
      value: rangeToString([p.start, p.end]),
      item: {
        label: p.label,
        value: p.value,
      },
    }))
})

const calendarSelected = computed(() => {
  const dates = []
  // let date = new Date(model.value[0])
  const dateEnd = new Date(model.value[1])
  for (let date = new Date(model.value[0]); date <= dateEnd; date = addDays(date, 1))
    dates.push(formatDate(date))
  return dates
})
let waitForEnd = false
function onCalendarSelect(value: string) {
  const values: [string, string] = [
    model.value[0],
    model.value[1],
  ]
  if (!waitForEnd) {
    values[0] = value
    values[1] = value
    waitForEnd = true
  }
  else {
    if (value > values[0]) {
      values[1] = value
    }
    else {
      values[1] = values[0]
      values[0] = value
    }
    waitForEnd = false
  }
  model.value = values
}

const formatValue = new Intl.DateTimeFormat(locale.value, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const value = computed(() => {
  const preset = presets.find(p => rangeToString([p.start, p.end]) === modelString.value)
  if (preset)
    return preset.label
  return formatValue.formatRange(new Date(model.value[0]), new Date(model.value[1]))
})
</script>

<template>
  <Item :label="$props.label ?? $t('date_range')" :value :disabled="readonly">
    <template v-if="!readonly" #page>
      <Card>
        <DateInput
          ref="input1"
          :model-value="model[0]"
          :label="$t('date_range_start')"
          @update:model-value="model = [$event, model[1]]"
          @next="input2.select('day')"
        />
        <DateInput
          ref="input2"
          :label="$t('date_range_end')"
          :model-value="model[1]"
          @update:model-value="model = [model[0], $event]"
          @prev="input1.select('year')"
        />
      </Card>
      <Card>
        <Tabs v-model="presetsTab" :tabs="presetsTabs" />
        <!-- <Separator /> -->
        <Select v-model="modelString" :options="presetsFiltered" />
      </Card>
      <DateCalendar :selected="calendarSelected" @select="onCalendarSelect" />
    </template>
  </Item>
</template>
