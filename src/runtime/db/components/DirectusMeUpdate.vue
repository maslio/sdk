<script setup lang="ts">
import { updateMe } from '@directus/sdk'
import { useDirectus } from '../composables/useDirectus'
import type { User } from '../utils/user'
import Menu from '../../ui/components/layout/Menu.vue'
import Card from '../../ui/components/elements/Card.vue'
import InputString from '../../ui/components/input/InputString.vue'
import Button from '../../ui/components/elements/Button.vue'
import { reactive, ref } from '#imports'

const { user } = defineProps<{
  user: User
}>()

const d = useDirectus()

const readonly = ref(true)
const data = reactive({
  first_name: user.first_name,
  last_name: user.last_name,
})
function edit() {
  readonly.value = false
}
async function save() {
  await d.request(updateMe(data))
  await d.refreshUser()
  readonly.value = true
}
async function logout() {
  await d.logout()
}
</script>

<template>
  <Menu v-if="readonly" v-slot="{ close }">
    <Button label="Edit" @click="edit(); close()" />
  </Menu>
  <Card>
    <InputString
      v-model="data.first_name"
      label="First name"
      :readonly
    />
    <InputString
      v-model="data.last_name"
      label="Last name"
      :readonly
    />
  </Card>
  <Button
    v-if="!readonly" label="Save"
    color="positive"
    :action="save"
  />
  <Button v-else label="Logout" :action="logout" />
</template>
