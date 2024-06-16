import type Open from '../components/open/Open.vue'
import { type Ref, ref } from '#imports'

export type OpenRef = Ref<InstanceType<typeof Open>>

export function openRef() {
  return ref() as OpenRef | undefined
}
