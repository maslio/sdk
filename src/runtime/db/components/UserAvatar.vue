<script setup lang="ts">
import type { User } from '@directus/types'

withDefaults(defineProps<{
  user: Record<string, any>
  size: string
}>(), {
  size: '20',
})
</script>

<template>
  <div
    relative
    overflow-hidden
    rounded-full
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <NuxtImg
      v-if="user.avatar"
      provider="directus"
      format="webp"
      :src="user.avatar"
      :width="size"
      :height="size"
    />
    <div v-else>
      <Icon
        class="text-neutral"
        name="material-symbols:account-circle"
        :size
      />
    </div>
  </div>
</template>
