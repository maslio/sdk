<script setup lang="ts">
import { updateMe } from '@directus/sdk'
import Card from '../../../ui/components/elements/Card.vue'
import Button from '../../../ui/components/elements/Button.vue'
import InputString from '../../../ui/components/inputs/InputString.vue'
import { useDirectus } from '../../composables/useDirectus'
import type { User } from './Me.vue'
import { reactive } from '#imports'

const { user } = defineProps<{ user: User }>()
const emit = defineEmits(['update'])

const { request } = useDirectus()

const form = reactive({
  first_name: user.first_name,
  last_name: user.last_name,
})

async function action() {
  await request(updateMe(form))
  setTimeout(() => {
    emit('update', form)
  }, 300)
}
</script>

<template>
  <Card>
    <InputString v-model="form.first_name" label="First name" />
    <InputString v-model="form.last_name" label="Last name" />
  </Card>
  <Button color="positive" label="Save" :action />
</template>
