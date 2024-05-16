<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

defineProps<{
  data: any
}>()
</script>

<template>
  <Item class="p-3">
    <VueJsonPretty
      :data="data"
      :theme="$colorMode.value === 'dark' ? 'dark' : 'light'"
    />
  </Item>
</template>
