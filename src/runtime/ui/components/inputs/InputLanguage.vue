<script setup lang="ts">
import { useFluent } from 'fluent-vue'
import InputSelect from './InputSelect.vue'

const props = defineProps<{
  codes: string[]
  native?: boolean
  label?: string
}>()

const { $t } = useFluent()

interface Language {
  code: string
  name: string
  native: string
  icon: string
}

const allLanguages: Language[] = [
  { code: 'en-US', name: $t('lang_english'), native: 'English', icon: '🇺🇸' },
  { code: 'ru-RU', name: $t('lang_russian'), native: 'Русский', icon: '🇷🇺' },
  { code: 'th-TH', name: $t('lang_thai'), native: 'ไทย', icon: '🇹🇭' },
  { code: 'ja-JP', name: $t('lang_japanese'), native: '日本語', icon: '🇯🇵' },
]

const options = allLanguages
  .filter(lang => props.codes.includes(lang.code))
  .map(lang => ({
    value: lang.code,
    item: {
      label: props.native ? lang.native : lang.name,
      icon: lang.icon,
      iconSize: '18',
    },
  }))

const model = defineModel<string>()
</script>

<template>
  <InputSelect v-model="model" :options :label="label ?? $t('lang')" />
</template>
