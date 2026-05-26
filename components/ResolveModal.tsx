'use client'

import { useState, useEffect, useRef, useId } from 'react'

interface Props {
  open: boolean
  action: 'dismiss' | 'remove' | null
  onConfirm: (action: 'dismiss' | 'remove', comment?: string) => void
  onCancel: () => void
  resolving?: boolean
}

export default function ResolveModal({ open, action, onConfirm, onCancel, resolving }: Props) {
  const [comment, setComment] = useState('')
  const confirmRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const commentId = useId()

  useEffect(() => {
    if (open) {
      setTimeout(() => confirmRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onCancel(); return }
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
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {action === 'dismiss' ? 'Desestimar reporte' : 'Eliminar reseña'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {action === 'dismiss'
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
            onClick={() => onConfirm(action!, comment)}
            disabled={resolving}
            className={`flex-1 py-3 sm:py-2 rounded-lg text-white font-medium text-sm disabled:opacity-50 transition-colors ${
              action === 'dismiss' ? 'bg-green-800 hover:bg-green-900' : 'bg-red-700 hover:bg-red-800'
            }`}
          >
            {resolving ? 'Procesando...' : 'Confirmar'}
          </button>
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
