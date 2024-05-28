export default defineEventHandler(async (event) => {
  const { prompt } = getQuery<{ prompt: string }>(event)
  const { getImage, requestAny } = useDirectus('admin')
  const { generateText, model } = useAi('openai')
  const me = await requestAny(readMe({ fields: ['avatar'] }))
  const { text } = await generateText({
    model: model('gpt-4o'),
    messages: [
      { role: 'user', content: [
        { type: 'image', image: await getImage(me.avatar) },
        { type: 'text', text: prompt },
      ] },
    ],
  })
  return text
})
