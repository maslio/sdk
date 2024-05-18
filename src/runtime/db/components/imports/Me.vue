<script setup lang="ts">
import { readMe, updateMe } from '@directus/sdk'
import { useDirectus } from '../../composables/useDirectus'
import Card from '../../../ui/components/elements/Card.vue'
import Item from '../../../ui/components/elements/Item.vue'
import InputString from '../../../ui/components/input/InputString.vue'
import Button from '../../../ui/components/elements/Button.vue'
import MeNames from './MeNames.vue'
import { reactive, useAsyncData } from '#imports'

export interface User {
  first_name: string
  last_name: string
}

const d = useDirectus()
const { data: user } = await useAsyncData(() => {
  return d.requestAny(readMe({
    fields: ['first_name', 'last_name', 'email', 'title', 'description', 'avatar', {
      role: ['id', 'name'],
    }],
  })) as Promise<User>
})
</script>

<template>
  <Card v-if="user">
    <Item label="Name" :value="`${user.first_name} ${user.last_name}`">
      <!-- <MeNames :user @update="update($event); close()" /> -->
      <!-- <DirectusForm collection="directus_users" :fields="['first_name', 'last_name']" /> -->
    </Item>
  </Card>
</template>
