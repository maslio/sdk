import { generateObject, generateText, tool } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOllama } from 'ollama-ai-provider'
import { useRuntimeConfig } from '#imports'

type Provider = 'openai' | 'google' | 'ollama'

interface Ai {
  tool: typeof tool
  generateText: typeof generateText
  generateObject: typeof generateObject
}

interface GoogleAI extends Ai {
  model: ReturnType<typeof createGoogleGenerativeAI>
}
interface OpenAI extends Ai {
  model: ReturnType<typeof createOpenAI>
}
interface OllamaAI extends Ai {
  model: ReturnType<typeof createOllama>
}

type UseAiReturnType<T extends Provider> =
  T extends 'google' ? GoogleAI :
    T extends 'openai' ? OpenAI :
      OllamaAI

export function useAi<T extends Provider>(provider: T): UseAiReturnType<T> {
  const model = (() => {
    if (provider === 'google') {
      const { googleAiApiKey } = useRuntimeConfig()
      if (!googleAiApiKey)
        throw new Error('Missing GoogleAI API key')
      return createGoogleGenerativeAI({ apiKey: googleAiApiKey as string })
    }
    if (provider === 'openai') {
      const { openaiApiKey } = useRuntimeConfig()
      if (!openaiApiKey)
        throw new Error('Missing OpenAI API key')
      return createOpenAI({ apiKey: openaiApiKey as string })
    }
    if (provider === 'ollama') {
      return createOllama({
        baseURL: 'http://localhost:11434/api',
      })
    }
  })()

  return {
    model,
    tool,
    generateText,
    generateObject,
  } as UseAiReturnType<T>
}
