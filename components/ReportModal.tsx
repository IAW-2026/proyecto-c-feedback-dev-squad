'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  open: boolean
  onSubmit: (razon: string) => Promise<void>
  onClose: () => void
}

export default function ReportModal({ open, onSubmit, onClose }: Props) {
  const [razon, setRazon] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleSubmit = async () => {
    if (!razon.trim()) {
      setError('Debes escribir un motivo.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onSubmit(razon.trim())
      setRazon('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al reportar.')
    } finally {
      setSubmitting(false)
    }
  }

  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="report-title">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 id="report-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Reportar reseña
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Indicá el motivo del reporte.
        </p>

        <label htmlFor="report-razon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Motivo del reporte
        </label>
        <textarea
          id="report-razon"
          value={razon}
          onChange={e => { setRazon(e.target.value); setError('') }}
          rows={4}
          maxLength={200}
          placeholder="Escribí el motivo..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 text-right">
          {razon.length}/200 caracteres (mín. 10)
        </p>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 px-4 py-2 rounded-lg mb-4" role="alert">{error}</p>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting || razon.trim().length < 10}
            className="flex-1 py-3 sm:py-2 rounded-lg text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-red-600 hover:bg-red-700"
          >
            {submitting ? 'Enviando...' : 'Reportar'}
          </button>
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-3 sm:py-2 rounded-lg font-medium text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}
