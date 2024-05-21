<script setup lang="ts">
import { useFluent } from 'fluent-vue'
import InputSelect from './InputSelect.vue'

const props = defineProps<{
  codes: string[]
  native?: boolean
  label?: string
}>()

const { $t } = useFluent()

const label = props.label || $t('lang')

interface Language {
  code: string
  name: string
  native: string
  icon: string
}

const allLanguages: Language[] = [
  { code: 'en', name: $t('english'), native: 'English', icon: '🇺🇸' },
  { code: 'ru', name: $t('russian'), native: 'Русский', icon: '🇷🇺' },
  { code: 'th', name: $t('thai'), native: 'ไทย', icon: '🇹🇭' },
  { code: 'jp', name: $t('japanese'), native: '日本語', icon: '🇯🇵' },
]

const options = allLanguages
  .filter(lang => props.codes.includes(lang.code))
  .map(lang => ({
    value: lang.code,
    label: props.native ? lang.native : lang.name,
    icon: lang.icon,
  }))

const model = defineModel<string>()
</script>

<template>
  <InputSelect v-model="model" :options :label />
</template>
