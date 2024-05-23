<script setup lang="ts">
import type { File as DirectusFile } from '@directus/types'
import { nanoid } from 'nanoid'
import prettyBytes from 'pretty-bytes'
import { uploadFiles } from '@directus/sdk'
import InputFiles from '../../ui/components/inputs/InputFiles.vue'
import Card from '../../ui/components/elements/Card.vue'
import Item from '../../ui/components/elements/Item.vue'
import Spinner from '../../ui/components/elements/Spinner.vue'
import { useDirectus } from '../composables/useDirectus'
import { reactive, ref } from '#imports'

const emit = defineEmits<{
  upload: [files: DirectusFile[]]
}>()

const { request } = useDirectus()

interface NewFile {
  id: string
  label: string
  size: string
  rawFile: File
  error?: any
  directusFile?: DirectusFile
}

const newFiles = ref<NewFile[]>([])

function setFiles(files: File[]) {
  newFiles.value = files.map(file => reactive({
    id: nanoid(),
    label: file.name,
    size: prettyBytes(file.size),
    rawFile: file,
  }))
  uploadNext()
}

async function upload(file: NewFile) {
  const formData = new FormData()
  formData.append('file', file.rawFile)
  try {
    file.directusFile = (await request(uploadFiles(formData))) as DirectusFile
  }
  catch (e) {
    file.error = e
  }
  uploadNext()
}

async function uploadNext() {
  const file = newFiles.value.find(f => !f.directusFile)
  if (file) { await upload(file) }
  else {
    const directusFiles = newFiles.value
      .filter(f => f.directusFile)
      .map(f => f.directusFile) as DirectusFile[]
    if (directusFiles.length)
      emit('upload', directusFiles)
  }
}
</script>

<template>
  <InputFiles
    v-if="newFiles.length === 0"
    @update:model-value="setFiles"
  />
  <Card v-else>
    <Item
      v-for="file in newFiles"
      :key="file.id"
      :label="file.label"
      :caption="file.size"
    >
      <template #left>
        <div class="h-10 w-10 flex items-center justify-center">
          <Icon
            v-if="file.error" name="material-symbols:error"
            class="shake text-negative"
          />
          <Spinner v-else-if="!file.directusFile" />
          <NuxtImg
            v-else
            provider="directus"
            :src="file.directusFile.id"
            width="40"
            height="40"
            class="h-10 w-10 rounded"
          />
        </div>
      </template>
    </Item>
  </Card>
</template>
