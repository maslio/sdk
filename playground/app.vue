<script setup lang="ts">
import Hello from './components/Hello.vue'

const next = ref()
// const bottom = openRef()
// const Hello = defineAsyncComponent(() => import('./components/Hello.vue'))
</script>

<template>
  <AuthLayout>
    <Item
      label="Hello"
      :open="{ ref: next, component: Hello }"
    />
    <Open ref="next" />
  </AuthLayout>
</template>
