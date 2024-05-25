<script setup lang="ts">
// const prompt = ref('')

const prompt = ref('')
const { refreshUser } = useDirectus()

const { data, status } = useLazyFetch('/api/ai/question', {
  immediate: false,
  query: { prompt },
  onResponse() {
    refreshUser()
  },
})

function send(text: string) {
  prompt.value = text
}
</script>

<template>
  <InputMessage :send />
  <Card v-if="status === 'pending'" class="p-3 text-center">
    <Spinner />
  </Card>

  <Card v-else-if="status === 'success' && data">
    <div m-3>
      {{ data }}
    </div>
  </Card>
</template>
