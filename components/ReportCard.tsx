'use client'

import { useState, useEffect, useRef, useId } from 'react'
import type { Report } from '../types'
import StarRating from './StarRating'
import { getAIOpinionAction } from '../app/actions'

interface Props {
  report: Report
  onResolve?: (reportId: string, action: 'dismiss' | 'remove', comment?: string) => void
  resolving?: boolean
}

export default function ReportCard({ report, onResolve, resolving }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState<'dismiss' | 'remove' | null>(null)
  const [comment, setComment] = useState('')
  const [aiOpinion, setAiOpinion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiExpanded, setAiExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const commentId = useId()

  const handleAIOpinion = async () => {
    if (aiExpanded) {
      setAiExpanded(false)
      return
    }
    setAiLoading(true)
    setAiError('')
    setAiExpanded(true)
    try {
      const opinion = await getAIOpinionAction(report.id)
      setAiOpinion(opinion)
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setAiLoading(false)
    }
  }

  const handleCopySuggestion = async () => {
    try {
      await navigator.clipboard.writeText(aiOpinion)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const handleOpenModal = (action: 'dismiss' | 'remove') => {
    setSelectedAction(action)
    setComment('')
    setShowModal(true)
  }

  const handleConfirm = () => {
    if (!selectedAction || !onResolve) return
    onResolve(report.id, selectedAction, comment)
    setShowModal(false)
    setSelectedAction(null)
  }

  useEffect(() => {
    if (showModal) {
      setTimeout(() => confirmRef.current?.focus(), 50)
    }
  }, [showModal])

  useEffect(() => {
    if (!showModal) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowModal(false); return }
      if (e.key === 'Tab') {
        if (!confirmRef.current || !cancelRef.current) return
        if (e.shiftKey && document.activeElement === confirmRef.current) {
          e.preventDefault()
          cancelRef.current.focus()
        } else if (!e.shiftKey && document.activeElement === cancelRef.current) {
          e.preventDefault()
          confirmRef.current.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [showModal])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Reporte de {report.reporterName ?? 'Usuario'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(report.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        {report.resuelto ? (
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Resuelto
          </span>
        ) : (
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pendiente
          </span>
        )}
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
          Motivo del reporte
        </p>
        <p className="text-sm text-red-700 dark:text-red-400">
          {report.razon}
        </p>
      </div>

      {report.review && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Reseña reportada
          </p>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {report.review.userName ?? 'Usuario'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(report.review.fecha).toLocaleDateString('es-ES')}
            </span>
          </div>
          {report.review.tipo === 'product' && report.review.sellerName && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Vendedor: {report.review.sellerName}
            </p>
          )}
          <StarRating rating={report.review.rating} size="sm" />
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            &ldquo;{report.review.comentario}&rdquo;
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {report.review.targetName ?? (report.review.tipo === 'product' ? 'Producto' : 'Vendedor')}
          </p>
        </div>
      )}

      {report.resuelto && report.resolvedBy && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              Resuelto por {report.resolvedBy}
            </p>
            {report.adminComment && (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                &ldquo;{report.adminComment}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}

      {!report.resuelto && onResolve && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleOpenModal('dismiss')}
              disabled={resolving}
              className="flex-1 min-w-[120px] py-3 sm:py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              Desestimar reporte
            </button>
            <button
              onClick={() => handleOpenModal('remove')}
              disabled={resolving}
              className="flex-1 min-w-[120px] py-3 sm:py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              Eliminar reseña
            </button>
            <button
              onClick={handleAIOpinion}
              disabled={aiLoading}
              className={`flex-1 min-w-[120px] py-3 sm:py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                aiExpanded
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {aiLoading ? 'Analizando...' : aiExpanded ? 'Cerrar IA' : '⚡ Opinión de la IA'}
            </button>
          </div>

          {aiExpanded && (
            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              {aiLoading ? (
                <div className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-300">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Analizando reporte con IA...</span>
                </div>
              ) : aiError ? (
                <p className="text-sm text-red-600 dark:text-red-400">{aiError}</p>
              ) : (
                <>
                  <p className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-wrap leading-relaxed">
                    {aiOpinion}
                  </p>
                  <button
                    onClick={handleCopySuggestion}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    {copied ? '¡Copiada!' : 'Copiar sugerencia'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4" onClick={() => setShowModal(false)} role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {selectedAction === 'dismiss' ? 'Desestimar reporte' : 'Eliminar reseña'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {selectedAction === 'dismiss'
                ? 'El reporte se marcará como resuelto y la reseña quedará publicada.'
                : 'La reseña se eliminará y el reporte quedará resuelto. Esta acción no se puede deshacer.'}
            </p>
            <label htmlFor={commentId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comentario (opcional)
            </label>
            <textarea
              id={commentId}
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Agregá un comentario..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none mb-1"
            />
            <p className="text-xs text-gray-400 mb-4 text-right">
              {comment.length}/500 caracteres
            </p>
            <div className="flex gap-3">
              <button
                ref={confirmRef}
                onClick={handleConfirm}
                disabled={resolving}
                className={`flex-1 py-3 sm:py-2 rounded-lg text-white font-medium text-sm disabled:opacity-50 transition-colors ${
                  selectedAction === 'dismiss' ? 'bg-green-800 hover:bg-green-900' : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                {resolving ? 'Procesando...' : 'Confirmar'}
              </button>
              <button
                ref={cancelRef}
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
