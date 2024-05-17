<script setup lang="ts">
import { useDirectus } from '../composables/useDirectus'
import Card from '../../ui/components/elements/Card.vue'
import InputPassword from '../../ui/components/input/InputPassword.vue'
import InputString from '../../ui/components/input/InputString.vue'
import Button from '../../ui/components/elements/Button.vue'
import { ref } from '#imports'

const d = useDirectus()
const email = ref('')
const password = ref('')

async function action() {
  await d.login(email.value, password.value)
}
</script>

<template>
  <div
    v-if="!d.user.value"
    class="fit flex items-center justify-center"
  >
    <div class="flex flex-col gap-3">
      <Card class="w-300px py-3">
        <InputString
          v-model="email" type="email"
          label="Email"
          autocomplete="username"
        />
        <InputPassword
          v-model="password"
          label="Password"
          autocomplete="current-password"
        />
      </Card>
      <Button label="Login" color="positive" :action />
    </div>
  </div>
  <slot v-else />
</template>
