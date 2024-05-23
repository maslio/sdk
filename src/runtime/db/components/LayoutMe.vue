<script setup lang="ts">
import type { User } from '@directus/types'
import { readMe, updateMe } from '@directus/sdk'
import { useDirectus } from '../composables/useDirectus'
import Card from '../../ui/components/elements/Card.vue'
import Item from '../../ui/components/elements/Item.vue'
import Form from './Form.vue'
import { useAsyncData } from '#imports'

const { requestAny, logout } = useDirectus()

const { data: user, refresh } = await useAsyncData(() => {
  return requestAny(readMe()) as Promise<User>
})

async function save(data: Record<string, any>) {
  await requestAny(updateMe(data))
  refresh()
}
</script>

<template>
  <template v-if="user">
    <Card>
      <Item :label="$t('user_name')" :value="`${user.first_name} ${user.last_name}`">
        <template #page="{ close }">
          <Form
            collection="directus_users"
            :fields="['first_name', 'last_name']"
            :values="user"
            :labels="{
              first_name: $t('user_first_name'),
              last_name: $t('user_last_name'),
            }"
            :save @save="close"
          />
        </template>
      </Item>
      <Item :label="$t('email')" :value="user.email ?? ''">
        <template #page="{ close }">
          <Form
            collection="directus_users"
            :fields="['email']"
            :values="user"
            :labels="{ email: $t('email') }"
            :save @save="close"
          />
        </template>
      </Item>
    </Card>
    <Button :click="logout" :label="$t('logout')" />
  </template>
</template>
