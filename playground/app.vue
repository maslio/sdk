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
    <Card>
      <Item label="Next">
        <template #page>
          <Item label="Next" page="next">
            <template #page>
              <div>hello next</div>
            </template>
          </Item>
          <Item label="Full" :page="{ target: 'full' }">
            <template #page>
              <div>hello full</div>
            </template>
          </Item>
        </template>
      </Item>
    </Card>
  </DbLayout>
</template>
