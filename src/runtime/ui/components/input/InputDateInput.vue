<script setup lang="ts">
import moment from 'dayjs'

const emit = defineEmits(['next', 'prev'])
// Rember a day that user typed in, but this day is not exist in current month.
// This day will be restored or cleared after use typein a new month
const rememberDay = ref<null | number>(null)
const model = defineModel<string>()
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
  const date = moment(value)
  values.day = String(date.date()).padStart(2, '0')
  values.month = String(date.month() + 1).padStart(2, '0')
  values.year = String(date.year()).padStart(4, '0')
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
  const maxDay = moment()
    .set('month', Number(values.month) - 1)
    .set('year', Number(values.year))
    .endOf('month').date()
  if (maxDay < Number(values.day)) {
    if (key === 'day') {
      rememberDay.value = Number(values.day)
    }
    else if (key === 'month') {
      rememberDay.value = null
      values.day = String(maxDay)
    }
  }
  else {
    rememberDay.value = null
  }
  const date = moment()
    .set('date', Number(values.day))
    .set('month', Number(values.month) - 1)
    .set('year', Number(values.year))
  if (date.isValid())
    model.value = date.format('YYYY-MM-DD')
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
  <div>
    <input
      ref="inputDay"
      v-model="values.day"
      v-maska
      placeholder="DD"
      data-maska="##"
      class="w-5.5 appearance-none overflow-hidden bg-transparent text-center font-mono outline-none"
      @click.stop="select('day')"
      @keydown="onKeydown('day', $event)"
      @blur="onBlur('day')"
    >
    .
    <input
      ref="inputMonth"
      v-model="values.month"
      v-maska
      placeholder="MM"
      data-maska="##"
      class="w-5.5 appearance-none overflow-hidden bg-transparent text-center font-mono outline-none"
      @click.stop="select('month')"
      @keydown="onKeydown('month', $event)"
      @blur="onBlur('month')"
    >
    .
    <input
      ref="inputYear"
      v-model="values.year"
      v-maska
      placeholder="ГГГГ"
      data-maska="####"
      class="w-10 appearance-none overflow-hidden bg-transparent text-center font-mono outline-none"
      @click.stop="select('year')"
      @keydown="onKeydown('year', $event)"
      @blur="onBlur('year')"
    >
  </div>
</template>
