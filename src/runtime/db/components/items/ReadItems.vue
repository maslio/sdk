<script setup lang="ts">
import { type Query, aggregate, readItems } from '@directus/sdk'
import { useDirectus } from '../../composables/useDirectus'
import List from '../../../ui/components/elements/List.vue'
import { type Ref, computed, ref, useAsyncData, useId } from '#imports'

const props = defineProps<{
  collection: string
  fields: string | string[]
  sort?: string | string[]
  search?: boolean
  filter?: Record<string, any>
  showEmpty?: boolean
  showTotal?: boolean
}>()

defineSlots<{
  default: (props: {
    item: Record<string, any>
    index: number
    selected?: Ref<boolean>
  }) => any
}>()

const fields = computed(() => {
  const fields = typeof props.fields === 'string' ? props.fields.split(' ') : props.fields
  if (!fields.includes('*') && !fields.includes('id'))
    fields.push('id')
  return fields
})
const sort = computed(() => {
  return typeof props.sort === 'string' ? props.sort.split(' ') : props.sort
})
const filter = computed(() => {
  return props.filter
})

const { requestAny } = useDirectus()
const search = ref('')
const limit = ref(10)
const id = useId()

const data = useAsyncData(`${id}data`, async () => {
  const query: Query<any, any> = {
    fields: fields.value,
    limit: limit.value,
  }
  if (props.sort)
    query.sort = sort.value
  if (props.filter)
    query.filter = filter.value
  if (props.search)
    query.search = search.value
  return requestAny(readItems(props.collection, query))
}, { watch: [search, limit, fields, sort, filter] })

const total = useAsyncData(`${id}total`, async () => {
  const query: Query<any, any> = {}
  if (props.filter)
    query.filter = filter.value
  if (props.search)
    query.search = search.value
  const result = await requestAny(aggregate(props.collection, {
    aggregate: { count: '*' },
    query,
  }))
  return Number(result[0].count)
}, { watch: [search, filter] })

defineExpose({
  refresh: async () => {
    data.refresh()
    total.refresh()
  },
})
await Promise.all([data, total])
</script>

<template>
  <List
    v-if="data.data.value?.length || showEmpty"
    v-model:limit="limit"
    :search="$props.search ? search : undefined"
    debounce="100"
    item-key="id"
    :data :total
    :show-total="showTotal"
    @update:search="search = $event"
  >
    <template #default="_props">
      <slot v-bind="_props" />
    </template>
  </List>
</template>
