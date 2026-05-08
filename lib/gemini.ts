import type { Report } from '../types'

const HF_TOKEN = process.env.GEMINI_API_KEY ?? process.env.HUGGINGFACE_API_KEY

async function queryHuggingFace(prompt: string): Promise<string | null> {
  if (!HF_TOKEN) return null

  try {
    const res = await fetch(
      'https://api-inference.huggingface.co/models/gpt2',
      {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 250, temperature: 0.7, return_full_text: false },
        }),
      },
    )

    if (!res.ok) return null

    const json = await res.json()
    return (json[0]?.generated_text ?? '').trim()
  } catch {
    return null
  }
}

export async function getAIOpinion(report: Report): Promise<string> {
  const prompt = `The following is a report about a review on a marketplace. Analyze it and provide an opinion in Spanish.

Report reason: "${report.razon}"
Review author: ${report.review?.userName ?? 'Anonymous'}
Rating: ${report.review?.rating ?? 'N/A'}/5
Review text: "${report.review?.comentario ?? 'No comment'}"
Product/Seller: ${report.review?.targetName ?? 'N/A'}

Opinion in Spanish:`

  const result = await queryHuggingFace(prompt)
  return result ?? 'La opinión de IA no está disponible en este momento. Intentalo de nuevo más tarde.'
}

export async function generateReviewSummary(
  targetName: string,
  reviews: { rating: number; comentario: string }[],
): Promise<string> {
  const reviewsText = reviews
    .map((r, i) => `Review ${i + 1}: ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)} - "${r.comentario}"`)
    .join('\n')

  const prompt = `Summarize the following reviews for "${targetName}" in Spanish in 2-3 sentences, highlighting the most mentioned positive and negative aspects.

${reviewsText}

Summary in Spanish:`

  const result = await queryHuggingFace(prompt)
  return result ?? 'No se pudo generar un resumen en este momento.'
}
