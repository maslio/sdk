<script setup lang="ts">
import { useDirectus } from '../../composables/useDirectus'
import Card from '../../../ui/components/elements/Card.vue'
import InputPassword from '../../../ui/components/inputs/InputPassword.vue'
import InputString from '../../../ui/components/inputs/InputString.vue'
import Button from '../../../ui/components/elements/Button.vue'
import { ref } from '#imports'

const d = useDirectus()
const email = ref('')
const password = ref('')

async function click() {
  await d.login(email.value, password.value)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <Card class="w-300px py-3">
      <InputString
        v-model="email"
        type="email"
        :label="$t('email')"
        autocomplete="username"
      />
      <InputPassword
        v-model="password"
        :label="$t('password')"
        autocomplete="current-password"
      />
    </Card>
    <Button
      :label="$t('sign_in')"
      color="primary"
      :click
    />
  </div>
</template>
