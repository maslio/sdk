import OpenAI from 'openai'
import { useRuntimeConfig } from '#imports'

export default function useOpenai() {
  const { openaiApiKey } = useRuntimeConfig()
  if (!openaiApiKey)
    throw new Error('Missing OpenAI API key')

  const openAI = new OpenAI({ apiKey: openaiApiKey as string })
  return openAI
}
