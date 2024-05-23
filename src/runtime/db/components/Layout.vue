<script setup lang="ts">
import Layout from '../../ui/components/layout/Layout.vue'
import { useDirectus } from '../composables/useDirectus'
import Item from '../../ui/components/elements/Item.vue'
import SignIn from './SignIn.vue'
import LayoutMe from './LayoutMe.vue'

const d = useDirectus()
const user = d.user
</script>

<template>
  <div
    v-if="!user"
    color="back"
    class="fit flex items-center justify-center"
  >
    <SignIn />
  </div>
  <Layout v-else root>
    <Item
      :label="`${user.first_name} ${user.last_name}`"
      :caption="user.email"
    >
      <template #page>
        <LayoutMe />
      </template>
    </Item>
    <slot />
  </Layout>
</template>
