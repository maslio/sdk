<script setup lang="ts">
import Hello from './components/Hello.vue'
import Items from './components/Items.vue'

const next = ref()
</script>

<template>
  <AuthLayout>
    <Card>
      <Item
        label="Hello"
        :open="{ ref: next, component: Hello }"
      />
      <Item label="Items" :open="{ ref: next, component: Items }" />
    </Card>
    <Open ref="next" />
  </AuthLayout>
</template>
