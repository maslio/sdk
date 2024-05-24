<script setup lang="ts">
import { endOfMonth } from 'date-fns'
import { formatDate } from '../../../base/utils/date'

import { reactive, ref, watch } from '#imports'

defineProps<{
  label?: string
}>()

const emit = defineEmits(['next', 'prev'])
// Rember a day that user typed in, but this day is not exist in current month.
// This day will be restored or cleared after use typein a new month
const rememberDay = ref<null | number>(null)
const model = defineModel<string>({ default: formatDate(new Date()) })
const inputDay = ref()
const inputMonth = ref()
const inputYear = ref()
const inputs = {
  day: inputDay,
  month: inputMonth,
  year: inputYear,
}
const values = reactive({
  day: '',
  month: '',
  year: '',
})
watch(model, (value) => {
  const date = new Date(value)
  values.day = String(date.getDate()).padStart(2, '0')
  values.month = String(date.getMonth() + 1).padStart(2, '0')
  values.year = String(date.getFullYear()).padStart(4, '0')
  if (rememberDay.value)
    values.day = String(rememberDay.value)
}, { immediate: true })

function select(key: keyof typeof inputs) {
  inputs[key].value.select()
}
function selectNext(key: keyof typeof inputs) {
  if (key === 'day')
    select('month')
  else if (key === 'month')
    select('year')
  else if (key === 'year')
    emit('next')
}
function selectPrev(key: keyof typeof inputs) {
  if (key === 'month')
    select('day')
  else if (key === 'year')
    select('month')
  else if (key === 'day')
    emit('prev')
}

function commit(key: keyof typeof inputs) {
  const maxDay = endOfMonth(new Date(Number(values.year), Number(values.month) - 1)).getDate()
  let day = Number(values.day)
  if (maxDay < Number(values.day)) {
    if (key === 'day') {
      rememberDay.value = Number(values.day)
    }
    else if (key === 'month') {
      rememberDay.value = null
      values.day = String(maxDay)
    }
    day = maxDay
  }
  else {
    rememberDay.value = null
  }
  const date = new Date(
    Number(values.year),
    Number(values.month) - 1,
    day,
  )
  model.value = formatDate(date)
}

function onInput(key: keyof typeof inputs) {
  const value = values[key]
  const fullLength = key === 'year' ? 4 : 2
  if (key === 'day') {
    if (Number(value) > 31)
      values[key] = '31'
  }
  else if (key === 'month') {
    if (Number(value) > 12)
      values[key] = '12'
  }
  if (value.length === fullLength) {
    selectNext(key)
    commit(key)
  }
}
function onKeydown(key: keyof typeof inputs, e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    selectNext(key)
  }
  else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    selectPrev(key)
  }
  else if (e.key === 'ArrowRight') {
    e.preventDefault()
    selectNext(key)
  }
  else if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(e.key)) {
    setTimeout(() => {
      onInput(key)
    })
  }
}
function onBlur(key: keyof typeof inputs) {
  const value = values[key]
  const fullLength = key === 'year' ? 4 : 2
  if (value.length !== fullLength) {
    values[key] = value.padStart(fullLength, '0')
    commit(key)
  }
}
defineExpose({ select })
</script>

<template>
  <div
    class="flex rounded-xl p-3 card:rounded-none"
    color="default"
    @click="select('day')"
  >
    <div class="flex-1 text-faint">
      {{ $props.label ?? $t('date') }}
    </div>
    <div>
      <input
        ref="inputDay"
        v-model="values.day"
        v-maska
        inputmode="numeric"
        data-maska="##"
        placeholder="DD"
        class="w-5.5 appearance-none overflow-hidden bg-transparent text-center font-mono outline-none"
        @mousedown.stop.prevent="select('day')"
        @click.stop.prevent
        @keydown="onKeydown('day', $event)"
        @blur="onBlur('day')"
      >
      .
      <input
        ref="inputMonth"
        v-model="values.month"
        v-maska
        inputmode="numeric"
        data-maska="##"
        placeholder="MM"
        class="w-5.5 appearance-none overflow-hidden bg-transparent text-center font-mono outline-none"
        @mousedown.stop.prevent="select('month')"
        @click.stop.prevent
        @keydown="onKeydown('month', $event)"
        @blur="onBlur('month')"
      >
      .
      <input
        ref="inputYear"
        v-model="values.year"
        v-maska
        inputmode="numeric"
        placeholder="YYYY"
        data-maska="####"
        class="w-10 appearance-none overflow-hidden bg-transparent text-center font-mono outline-none"
        @mousedown.stop.prevent="select('year')"
        @click.stop.prevent
        @keydown="onKeydown('year', $event)"
        @blur="onBlur('year')"
      >
    </div>
  </div>
</template>
