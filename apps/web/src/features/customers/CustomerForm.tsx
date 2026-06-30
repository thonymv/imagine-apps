import { useState } from 'react'
import type { FormEvent } from 'react'

import { ApiError } from '../../api/client'
import type { CustomerCreate } from '../../api/types'

interface CustomerFormProps {
  onSubmit: (data: CustomerCreate) => Promise<void>
  busy: boolean
}

export function CustomerForm({ onSubmit, busy }: CustomerFormProps) {
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
    <form className="form" onSubmit={handleSubmit}>
      <h3>Nuevo cliente</h3>
      <label className="field">
        <span>Nombre</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Empresa (opcional)</span>
        <input value={company} onChange={(e) => setCompany(e.target.value)} />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={busy}>
        {busy ? 'Creando…' : 'Crear'}
      </button>
    </form>
  )
}
