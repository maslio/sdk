<script setup lang="ts">
export interface Props {
  component: string
  props?: any
  options?: {
    label?: string
    props: any
  }[]
}
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  props: {},
})

function propsToString(props: Record<string, any>) {
  const string = JSON.stringify(props, null, 2)
  return string.replace(/\"/g, '')
    .substring(4, string.length - 6)
}

const component = resolveComponent(props.component)
const options = !props.options
  ? []
  : props.options.map(o => ({
    props: o.props,
    label: o.label ?? propsToString(o.props),
  }))
const selected = ref(0)
const bind = ref({
  ...props.props,
  ...options[selected.value]?.props,
})
const error = ref<Error | null>(null)

async function update() {
  error.value = null
  bind.value = null
  await nextTick()
  bind.value = {
    ...props.props,
    ...options[selected.value]?.props,
  }
}
watch(selected, update)

onErrorCaptured((e: Error) => {
  error.value = e
  console.error(e)
  return false
})
</script>

<template>
  <Card>
    <InputOption
      v-for="(opt, index) in options" :key="opt.label"
      v-model="selected"
      :value="index"
      :label="opt.label"
      font-mono
      @click="update"
    />
  </Card>
  <template v-if="bind">
    <div v-if="error" class="h-full flex flex-col items-center">
      <Icon name="tabler:face-id-error" size="100" />
      <div w-full p-3 text-faint>
        {{ error }}
      </div>
    </div>

    <Component :is="component" v-else v-bind="bind" />
  </template>
</template>
