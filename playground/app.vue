<script setup lang="ts">
import delay from 'delay'

async function click() {
  await delay(1000)
  throw new Error('EEEEEE')
}
</script>

<template>
  <DirectusLogin>
    <Layout root>
      <!-- <DirectusMe /> -->
      <Button label="Hello" page="next" :click />
    </Layout>
  </DirectusLogin>
</template>
