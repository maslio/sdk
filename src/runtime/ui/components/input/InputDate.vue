<script setup lang="ts">
import dt from 'dayjs'
import { presetsPoint } from './date'

withDefaults(defineProps<{
  label?: string
  readonly?: boolean
}>(), {
  label: 'Date',
})
const model = defineModel<string>({
  default: dt().format('YYYY-MM-DD'),
})
function onCalendarSelect(value: string) {
  model.value = value
}
const presets = presetsPoint()

const value = computed(() => {
  const preset = presets.find(p => p.value.format('YYYY-MM-DD') === model.value)
  if (preset)
    return preset.label
  return dt(model.value).format('DD.MM.YYYY')
})
</script>

<template>
  <Item :label :value :disabled="readonly">
    <template v-if="!readonly" #default>
      <Card>
        <div class="px-3 py-2 text-center">
          <label text-faint>Дата</label>
          <InputDateInput v-model="model" />
        </div>
      </Card>
      <Card>
        <InputOption
          v-for="preset in presets" :key="preset.label"
          v-model="model"
          :label="preset.label"
          :caption="preset.value.format('DD.MM.YYYY')"
          :value="preset.value.format('YYYY-MM-DD')"
        />
      </Card>
      <InputDateCalendar :selected="[model]" @select="onCalendarSelect" />
    </template>
  </Item>
</template>
