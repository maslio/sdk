<script setup lang="ts">
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
    <DbFilesUpload />
  </DbLayout>
</template>
