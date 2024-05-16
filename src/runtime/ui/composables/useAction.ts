import { ref } from '#imports'

export function useAction<Args extends any[], ReturnType>(callback?: (...args: Args) => ReturnType) {
  const pending = ref(false)
  const error = ref<Error | string | undefined>()
  const shake = ref('')
  const shakeClass = 'animate-shake-x animate-duration-500'

  async function action(...params: Args): Promise<ReturnType | undefined> {
    if (!callback)
      return
      // throw new Error('Callback function is not provided')
    pending.value = true

    try {
      const result = await callback(...params)
      return result
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      shake.value = shakeClass
      setTimeout(() => {
        shake.value = ''
      }, 500)
    }
    finally {
      pending.value = false
    }
  }

  return { pending, error, action, shake }
}
