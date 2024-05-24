<script setup lang="ts">
import type { File, User } from '@directus/types'
import { readMe, updateMe } from '@directus/sdk'
import delay from 'delay'
import { useDirectus } from '../composables/useDirectus'
import Card from '../../ui/components/elements/Card.vue'
import Item from '../../ui/components/elements/Item.vue'
import Button from '../../ui/components/elements/Button.vue'
import UserAvatar from './UserAvatar.vue'
import Form from './Form.vue'
import FilesUpload from './FilesUpload.vue'
import { ref, useAsyncData } from '#imports'

await delay(500)

const { requestAny, logout, refreshUser } = useDirectus()

const { data: user, refresh } = await useAsyncData(() => {
  return requestAny(readMe()) as Promise<User>
})

async function save(data: Record<string, any>) {
  await requestAny(updateMe(data))
  refresh()
  refreshUser()
}

const newAvatar = ref<File>()
function uploadAvatar(files: File[]) {
  newAvatar.value = files[0]
}
function saveAvatar(close: () => void) {
  return async () => {
    await save({ avatar: newAvatar.value })
    newAvatar.value = undefined
    close()
  }
}
</script>

<template>
  <Menu>
    <Item label="hello" />
  </Menu>
  <template v-if="user">
    <Card>
      <Item label="Change avatar" icon="material-symbols:add-a-photo">
        <template #page="{ close }">
          <FilesUpload @upload="uploadAvatar" />
          <Button
            v-if="newAvatar" color="primary"
            label="Save"
            :click="saveAvatar(close)"
          />
        </template>
      </Item>
    </Card>
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
