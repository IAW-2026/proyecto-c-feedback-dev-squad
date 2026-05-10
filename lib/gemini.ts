import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Report } from '../types'

const API_KEY = process.env.GEMINI_API_KEY

async function queryGemini(prompt: string): Promise<string> {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY no está definida en el entorno')
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const trimmed = text.trim()
    if (!trimmed) {
      throw new Error('La respuesta de Gemini vino vacía')
    }
    return trimmed
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Error desconocido al consultar Gemini')
  }
}

export async function getAIOpinion(report: Report): Promise<string> {
  const prompt = `Analizá el siguiente reporte de una reseña y dame tu opinión en español en no más de 2 frases.

Motivo del reporte: "${report.razon}"
Autor de la reseña: ${report.review?.userName ?? 'Anónimo'}
Calificación: ${report.review?.rating ?? 'N/A'}/5
Comentario: "${report.review?.comentario ?? 'Sin comentario'}"
Producto/Vendedor: ${report.review?.targetName ?? 'N/A'}

Opinión:`

  const geminiResult = await queryGemini(prompt)
  if (geminiResult) return geminiResult

  return 'La opinión de IA no está disponible en este momento. Intentalo de nuevo más tarde.'
}

export async function generateReviewSummary(
  targetName: string,
  reviews: { rating: number; comentario: string }[],
): Promise<string> {
  const reviewsText = reviews
    .map((r, i) => `Reseña ${i + 1}: ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)} - "${r.comentario}"`)
    .join('\n')

  const prompt = `Resumí las siguientes reseñas de "${targetName}" en 2-3 oraciones en español, destacando los aspectos positivos y negativos más mencionados.

${reviewsText}

Resumen:`

  const geminiResult = await queryGemini(prompt)
  if (geminiResult) return geminiResult

  return 'No se pudo generar un resumen en este momento.'
}
