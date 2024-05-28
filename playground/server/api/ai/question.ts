import { Buffer } from 'node:buffer'

// async function blobToBase64(blob: Blob): Promise<string> {
//   const arrayBuffer = await blob.arrayBuffer()
//   const buffer = Buffer.from(arrayBuffer)
//   return buffer.toString('base64')
// }

export default defineEventHandler(async (event) => {
  const { prompt } = getQuery<{ prompt: string }>(event)
  const { generateObject, model } = useAi('openai')
  const { object } = await generateObject({
    model: model('gpt-3.5-turbo'),
    system: 'You answer in two languages: english and russian',
    prompt,
    schema: z.object({
      russian: z.string(),
      english: z.string(),
    }),
  })
  return object
})
