import { ref } from '#imports'

export function useAction<Args extends any[], ReturnType>(callback?: (...args: Args) => ReturnType) {
  const pending = ref(false)
  const error = ref()
  const shake = ref(false)

  async function action(...params: Args): Promise<ReturnType | undefined> {
    if (!callback)
      return
      // throw new Error('Callback function is not provided')
    pending.value = true
    error.value = null
    try {
      const result = await callback(...params)
      return result
    }
    catch (err) {
      console.error(err)
      error.value = err
      shake.value = true
      setTimeout(() => {
        shake.value = false
      }, 500)
    }
    finally {
      pending.value = false
    }
  }

  return { pending, error, action, shake }
}
