<script setup lang="ts">
</script>

<template>
  <DbLayout>
    <InputLanguage
      :codes="$locales"
      :model-value="$locale"
      @update:model-value="$changeLocale"
    />
    <Card>
      <InputDate />
      <InputDateRange />
    </Card>
    <Item label="Question" :page="{ target: 'next', width: 500 }">
      <template #page>
        <Question />
      </template>
    </Item>
  </DbLayout>
</template>
