<script setup lang="ts">
import type { User } from '@directus/types'
import { readMe, updateMe } from '@directus/sdk'
import { useDirectus } from '../composables/useDirectus'
import Item from '../../ui/components/elements/Item.vue'
import { useAsyncData } from '#imports'

const { requestAny } = useDirectus()

const { data: user } = await useAsyncData(() => {
  return requestAny(readMe()) as Promise<User>
})
</script>

<template>
  <template v-if="user">
    <Item :label="$t('user_name')" :value="`${user.first_name} ${user.last_name}`">
      <template #page>
        <div>User</div>
      </template>
    </Item>
  </template>
</template>
