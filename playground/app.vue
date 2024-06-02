<script setup lang="ts">
// const next = openRef()
// const bottom = openRef()
// const Hello = defineAsyncComponent(() => import('./components/Hello.vue'))
</script>

<template>
  <Layout>
    <Menu v-slot="{ close }">
      <Button label="Hello" @click="close" />
    </Menu>
  </Layout>
</template>
