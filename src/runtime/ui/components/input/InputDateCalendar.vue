<script setup lang="ts">
import dt from 'dayjs'

const { selected } = defineProps<{
  selected: string[]
}>()

const emit = defineEmits(['select'])

let skipUpdate = false

const format = 'YYYY-MM-DD'

const currentMonth = computed(() => dt().month())
const weekDays = daysForLocale(undefined, 'short').map(i => i.slice(0, 2))

const months = monthsForLocale()
const selectedMonth = ref(dt().month())
const selectedYear = ref(dt().year())
const open = ref()
function setYear(year: number) {
  selectedYear.value = year
}
function setMonth(index: number) {
  selectedMonth.value = index
  open.value?.close?.()
}
function setAuto() {
  if (skipUpdate) {
    skipUpdate = false
    return
  }
  const date = dt(selected[0])
  setYear(date.year())
  setMonth(date.month())
}
watch(() => selected, setAuto, { immediate: true })

const calendarDays = computed(() => {
  const days = []
  const today = dt().format(format)
  const selected = dt().set('month', selectedMonth.value).set('year', selectedYear.value)
  let firstDay = selected.startOf('month').subtract(1, 'day')
  while (firstDay.day() !== 1)
    firstDay = firstDay.subtract(1, 'day')
  let lastDay = selected.endOf('month').add(1, 'day')
  while (lastDay.day() !== 6)
    lastDay = lastDay.add(1, 'day')
  lastDay = lastDay.add(1, 'day')
  for (let day = firstDay.clone(); day.format() <= lastDay.format(); day = day.add(1, 'day')) {
    const formated = day.format(format)
    days.push({
      label: day.date(),
      date: formated,
      inSelectedMonth: day.month() === selectedMonth.value && day.year() === selectedYear.value,
      isToday: formated === today,
    })
  }
  return days
})

function select(date: string) {
  emit('select', date)
  skipUpdate = true
}
</script>

<template>
  <Card>
    <Item open="float">
      <template #main>
        <div ml-4 text-center>
          {{ months[selectedMonth] }} {{ selectedYear }}
        </div>
      </template>
      <template #default>
        <div>
          <div flex select-none>
            <div
              class="clickable flex flex-1 items-center justify-start p-3 text-sm text-faint"
              color="default"
              @click="setYear(selectedYear - 1)"
            >
              <Icon name="fluent:chevron-left-16-filled" size="20" />
              {{ selectedYear - 1 }}
            </div>
            <div flex-1 p-3 text-center>
              {{ selectedYear }}
            </div>
            <div
              class="clickable flex flex-1 items-center justify-end p-3 text-sm text-faint"
              color="default"
              @click="setYear(selectedYear + 1)"
            >
              {{ selectedYear + 1 }}
              <Icon name="fluent:chevron-right-16-filled" size="20" />
            </div>
          </div>
        </div>
        <div>
          <div w-270px flex flex-wrap p-1 text-sm>
            <div
              v-for="(month, index) in months"
              :key="month"
              class="flex-1/3 p-0.5"
            >
              <div
                class="clickable truncate rounded px-1 py-2 text-center capitalize ring-neutral-500"
                :class="{ 'ring-1': index === currentMonth && index !== selectedMonth }"
                :color="index === selectedMonth ? 'contrast' : 'default'"
                @click="setMonth(index)"
              >
                {{ month }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </Item>
    <Separator />
    <div class="flex flex-wrap p-2">
      <div
        v-for="day in weekDays" :key="day"
        class="flex-1/7 p-1px text-center"
      >
        <div text-faint>
          {{ day }}
        </div>
      </div>
    </div>
    <Separator />
    <div class="flex flex-wrap p-2">
      <div
        v-for="day in calendarDays" :key="day.date"
        class="flex-1/7 p-1px text-center"
      >
        <div
          class="clickable rounded p-1 ring-neutral-500"
          :color="selected.includes(day.date) ? 'contrast' : 'default'"
          :class="{ 'text-faint': !day.inSelectedMonth, 'ring-1': (day.isToday && !selected.includes(day.date)) }"
          @click="select(day.date)"
        >
          {{ day.label }}
        </div>
      </div>
    </div>
  </Card>
</template>
