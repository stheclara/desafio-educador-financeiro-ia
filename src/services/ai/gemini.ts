import { GoogleGenAI } from '@google/genai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  throw new Error(
    'A variável VITE_GEMINI_API_KEY não foi configurada.',
  )
}

const ai = new GoogleGenAI({
  apiKey,
})

export async function generateFinancialAnalysis(
  prompt: string,
) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
  })

  return response.text ?? ''
}