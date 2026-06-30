import { useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import type { CustomerCreate } from '../../api/types'
import { Button } from '../../components/Button'

interface CustomerFormProps {
  busy: boolean
  onSubmit: (data: CustomerCreate) => Promise<void>
  onCancel: () => void
}

const inputClass =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100'

export function CustomerForm({ busy, onSubmit, onCancel }: CustomerFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit({
        name,
        email,
        company: company.trim() || undefined,
      })
      setName('')
      setEmail('')
      setCompany('')
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('Ya existe un cliente con ese email.')
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Nombre
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Empresa (opcional)
        </label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inputClass}
        />
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
          {busy ? 'Creando…' : 'Crear cliente'}
        </Button>
      </div>
    </form>
  )
}
