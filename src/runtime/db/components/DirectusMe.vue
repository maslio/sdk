<script setup lang="ts">
import { updateMe } from '@directus/sdk'
import { useDirectus } from '../composables/useDirectus'
import Item from '../../ui/components/elements/Item.vue'
import Card from '../../ui/components/elements/Card.vue'
import DirectusForm from './DirectusForm.vue'

const d = useDirectus()
const user = d.user

async function save(data: Record<string, any>) {
  await d.request(updateMe(data))
  d.refreshUser()
}
</script>

<template>
  <Card v-if="user">
    <Item
      :label="`${user.first_name} ${user.last_name}`"
      :caption="user.email"
    >
      <template #left>
        <div class="h-8 w-8 overflow-hidden rounded-full p-2px">
          <Icon name="material-symbols:account-circle" size="28" class="rounded-full" />
        </div>
      </template>
      <template #default="{ close }">
        <DirectusForm
          collection="directus_users"
          :fields="['first_name', 'last_name']"
          :values="user" :save
          @save="close"
        />
      </template>
    </Item>
  </Card>
</template>
