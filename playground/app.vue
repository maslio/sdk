<script setup lang="ts">
</script>

<template>
  <DirectusLogin>
    <Layout root>
      <InputLanguage
        :codes="$locales"
        :model-value="$locale.value"
        @update:model-value="$changeLocale"
      />
      <Card>
        <InputDate />
        <InputDateRange />
      </Card>
    </Layout>
  </DirectusLogin>
</template>
