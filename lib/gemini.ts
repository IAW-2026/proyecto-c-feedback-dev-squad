import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Report, CreateReviewInput } from '../types'

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

export async function moderateReview(input: CreateReviewInput): Promise<{ approved: boolean; reason: string }> {
  const prompt = `Actuás como moderador de reseñas de un e-commerce de zapatillas. Evaluá la siguiente reseña y devolvé SOLO un JSON con dos campos: "approved" (boolean) y "reason" (string vacío si approved es true, o explicación si es false).

La reseña debe ser rechazada si:
- Contiene insultos, lenguaje ofensivo o discriminación
- No tiene sentido o es incoherente
- No está relacionada con el producto o vendedor
- Es spam o publicidad no relacionada

La razón debe ser una frase breve de máximo 10 palabras.

Reseña a evaluar:
Rating: ${input.rating}/5
Comentario: "${input.comentario}"
Tipo: ${input.tipo === 'product' ? 'producto' : 'vendedor'}
Target: ${input.targetId}

JSON:`

  const raw = await queryGemini(prompt)
  const cleaned = raw.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(cleaned)
  return {
    approved: parsed.approved === true,
    reason: typeof parsed.reason === 'string' ? parsed.reason : '',
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
