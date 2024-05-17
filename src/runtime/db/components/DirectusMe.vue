<script setup lang="ts">
import { useDirectus } from '../composables/useDirectus'
import Item from '../../ui/components/elements/Item.vue'
import Card from '../../ui/components/elements/Card.vue'
import DirectusMeUpdate from './DirectusMeUpdate.vue'

const d = useDirectus()
const user = d.user
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
      <DirectusMeUpdate :user />
    </Item>
  </Card>
</template>
