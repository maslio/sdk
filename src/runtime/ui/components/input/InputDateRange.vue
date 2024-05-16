<script setup lang="ts">
import dt from 'dayjs'

defineProps<{
  label: string
  readonly?: boolean
}>()
const model = defineModel<[string, string]>({
  default: [
    dt().format('YYYY-MM-DD'),
    dt().format('YYYY-MM-DD'),
  ],
})
const input1 = ref()
const input2 = ref()

const calendarSelected = computed(() => {
  const dates = []
  let date = dt(model.value[0])
  const dateEnd = dt(model.value[1]).format('YYYY-MM-DD')
  while (date.format('YYYY-MM-DD') <= dateEnd) {
    dates.push(date.format('YYYY-MM-DD'))
    date = date.add(1, 'day')
  }
  return dates
})
let waitForEnd = false
function onCalendarSelect(value: string) {
  if (!waitForEnd) {
    model.value[0] = value
    model.value[1] = value
    waitForEnd = true
  }
  else {
    if (value > model.value[0]) {
      model.value[1] = value
    }
    else {
      model.value[1] = model.value[0]
      model.value[0] = value
    }
    waitForEnd = false
  }
}

function rangeToString(range: [string, string]) {
  return `${range[0]} - ${range[1]}`
}
function stringToRange(string: string) {
  return string.split(' - ') as [string, string]
}

const modelString = computed({
  get() {
    return rangeToString(model.value)
  },
  set(value) {
    model.value = stringToRange(value)
  },
})

const presets = presetsRange()
const presetsDay = presets.filter(p => p.type === 'day')
const presetsWeek = presets.filter(p => p.type === 'week')
const presetsMonth = presets.filter(p => p.type === 'month')

const value = computed(() => {
  const preset = presets.find(p => p.value === modelString.value)
  if (preset)
    return preset.label
  if (dt(model.value[0]).format('YYYY-MM-DD') === dt(model.value[1]).format('YYYY-MM-DD'))
    return `${dt(model.value[0]).format('D MMM')}`
  if (dt(model.value[0]).year() === dt(model.value[1]).year())
    return `${dt(model.value[0]).format('D MMM')} - ${dt(model.value[1]).format('D MMM YYYY')}`
  return `${dt(model.value[0]).format('D MMM YYYY')} - ${dt(model.value[1]).format('D MMM YYYY')}`
})
</script>

<template>
  <Item :label :value :disabled="readonly">
    <template v-if="!readonly" #default>
      <Card>
        <div px-3 py-2>
          <div flex>
            <div flex-1 text-center>
              <label text-faint>Начало периода</label>
              <InputDateInput ref="input1" v-model="model[0]" label="Начало периода" @next="input2.select('day')" />
            </div>
            <div flex-1 text-center>
              <label text-faint>Конец периода</label>
              <InputDateInput ref="input2" v-model="model[1]" label="Конец периода" @prev="input1.select('year')" />
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <InputOption
          v-for="preset in presetsDay" :key="preset.label"
          v-model="modelString"
          :label="preset.label"
          :caption="preset.caption"
          :value="preset.value"
        />
        <Separator ml-11 />
        <InputOption
          v-for="preset in presetsWeek" :key="preset.label"
          v-model="modelString"
          :label="preset.label"
          :caption="preset.caption"
          :value="preset.value"
        />
        <Separator ml-11 />
        <InputOption
          v-for="preset in presetsMonth" :key="preset.label"
          v-model="modelString"
          :label="preset.label"
          :caption="preset.caption"
          :value="preset.value"
        />
      </Card>
      <InputDateCalendar :selected="calendarSelected" @select="onCalendarSelect" />
    </template>
  </Item>
</template>
