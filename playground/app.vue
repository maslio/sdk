<script setup lang="ts">
const files = ref<File[]>([])
</script>

<template>
  <DbLayout>
    <InputLanguage
      :codes="$locales"
      :model-value="$locale.value"
      @update:model-value="$changeLocale"
    />
    <Card>
      <InputDate />
      <InputDateRange />
    </Card>
    <InputFiles v-model="files" />
    <Card>
      <Item
        v-for="file in files" :key="file.name"
        :label="file.name"
      />
    </Card>
  </DbLayout>
</template>
