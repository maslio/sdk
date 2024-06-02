<script setup lang="ts">
import type { File, User } from '@directus/types'
import { readMe, updateMe } from '@directus/sdk'
import { useFluent } from 'fluent-vue'
import { useDirectus } from '../../composables/useDirectus'
import Card from '../../../ui/components/elements/Card.vue'
import Item from '../../../ui/components/elements/Item.vue'
import Button from '../../../ui/components/elements/Button.vue'
import Form from '../form/Form.vue'
import UserAvatar from '../users/UserAvatar.vue'
import FilesUpload from '../files/FilesUpload.vue'
import { openRef } from '../../../ui/utils/open'
import Open from '../../../ui/components/open/Open.vue'
import { ref, useAsyncData } from '#imports'

const { requestAny, logout, refreshUser } = useDirectus()
const { $t } = useFluent()
const { data: user, refresh } = await useAsyncData(() => {
  return requestAny(readMe()) as Promise<User>
})

const openAvatar = openRef()
const openForm = openRef()

async function save(data: Record<string, any>) {
  await requestAny(updateMe(data))
  refresh()
  refreshUser()
  openForm?.value.close()
}

const newAvatar = ref<File>()
function uploadAvatar(files: File[]) {
  newAvatar.value = files[0]
}
async function saveAvatar() {
  await save({ avatar: newAvatar.value })
  newAvatar.value = undefined
  openAvatar?.value.close()
}
const formLabels = {
  first_name: $t('user_first_name'),
  last_name: $t('user_last_name'),
}
</script>

<template>
  <template v-if="user">
    <div flex justify-center pb-3>
      <UserAvatar :user size="100" />
    </div>
    <Card>
      <Item
        label="Change avatar"
        icon="material-symbols:add-a-photo"
        :open="{ ref: openAvatar }"
      />
    </Card>
    <Card>
      <Item
        id="name"
        :label="$t('user_name')"
        :value="`${user.first_name} ${user.last_name}`"
        :open="{
          ref: openForm,
          props: { fields: ['first_name', 'last_name'] },
        }"
      />
      <Item
        id="email"
        :label="$t('email')"
        :value="user.email ?? ''"
        :open="{
          ref: openForm,
          props: { fields: ['email'] },
        }"
      />
    </Card>
    <Button :click="logout" :label="$t('logout')" />

    <Open ref="openAvatar" label="Upload new avatar">
      <FilesUpload @upload="uploadAvatar" />
      <Button
        v-if="newAvatar" color="primary"
        label="Save"
        :click="saveAvatar"
      />
    </Open>

    <Open ref="openForm" v-slot="{ props }">
      <Form
        collection="directus_users"
        :fields="props.fields"
        :values="user"
        :labels="formLabels"
        :submit="save"
      />
    </Open>
  </template>
</template>
