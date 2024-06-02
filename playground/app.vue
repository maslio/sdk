<script setup lang="ts">
const next = openRef()
const bottom = openRef()
const Hello = defineAsyncComponent(() => import('./components/Hello.vue'))
</script>

<template>
  <Layout root>
    <Item
      label="Item" open
      :opened="next?.opened('Item')"
      @click="next.open({
        id: 'Item',
        props: { name: 'Item' },
        component: Hello,
        label: 'Item',
      })"
    />

    <Open ref="next" v-slot="{ component, props }" target="bottom">
      <Component :is="component" v-bind="props" />
      <Button label="Bottom" @click="bottom.open(); next.close()" />
    </Open>

    <Open ref="bottom">
      <div>hello bottom</div>
    </Open>
  </Layout>
</template>
