<script setup lang="ts">
import UserAvatar from '../users/UserAvatar.vue'
import Layout from '../../../ui/components/layout/Layout.vue'
import Item from '../../../ui/components/elements/Item.vue'
import { useDirectus } from '../../composables/useDirectus'
import Open from '../../../ui/components/open/Open.vue'
import { openRef } from '../../../ui/utils/open'
import AuthMe from './AuthMe.vue'
import AuthSignIn from './AuthSignIn.vue'

const me = openRef()
const d = useDirectus()
const user = d.user
</script>

<template>
  <div
    v-if="!user"
    color="back"
    class="fit flex items-center justify-center"
  >
    <AuthSignIn />
  </div>
  <Layout v-else root>
    <Item
      :label="`${user.first_name} ${user.last_name}`"
      :caption="user.email"
      :open="{ ref: me }"
    >
      <template #left>
        <UserAvatar :user="user" size="40" />
      </template>
    </Item>
    <Open
      ref="me"
      :component="AuthMe"
      :label="`${user.first_name} ${user.last_name}`"
    />
    <slot />
  </Layout>
</template>
