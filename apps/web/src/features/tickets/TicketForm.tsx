import { useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import {
  TICKET_STATUSES,
  TICKET_STATUS_LABEL,
  type Customer,
  type TicketCreate,
  type TicketStatus,
} from '../../api/types'
import { Button } from '../../components/Button'

interface TicketFormProps {
  customers: Customer[]
  busy: boolean
  onSubmit: (data: TicketCreate) => Promise<void>
  onCancel: () => void
}

const inputClass =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100'

export function TicketForm({
  customers,
  busy,
  onSubmit,
  onCancel,
}: TicketFormProps) {
  const [customerId, setCustomerId] = useState<number | ''>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TicketStatus>('pendiente')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (customerId === '') {
      setError('Selecciona un cliente.')
      return
    }
    try {
      await onSubmit({
        customer_id: Number(customerId),
        title,
        description,
        status,
      })
      setTitle('')
      setDescription('')
      setStatus('pendiente')
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('El cliente seleccionado ya no existe.')
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Cliente
        </label>
        <select
          value={customerId}
          onChange={(e) =>
            setCustomerId(e.target.value === '' ? '' : Number(e.target.value))
          }
          required
          className={inputClass}
        >
          <option value="">— Selecciona —</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              #{c.id} — {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Título
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Estado
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TicketStatus)}
          className={inputClass}
        >
          {TICKET_STATUSES.map((s) => (
            <option key={s} value={s}>
              {TICKET_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={busy}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={busy}>
          {busy ? 'Creando…' : 'Crear ticket'}
        </Button>
      </div>
    </form>
  )
}
