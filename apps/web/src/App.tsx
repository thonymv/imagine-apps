import { useState } from 'react'

import { useCustomers } from './hooks/useCustomers'
import { useTickets } from './hooks/useTickets'
import { CustomerList } from './features/customers/CustomerList'
import { CustomerForm } from './features/customers/CustomerForm'
import { TicketList } from './features/tickets/TicketList'
import { TicketForm } from './features/tickets/TicketForm'
import type { TicketCreate, TicketStatus } from './api/types'

import './App.css'

type Tab = 'customers' | 'tickets'

function App() {
  const [tab, setTab] = useState<Tab>('customers')
  const customers = useCustomers()
  const tickets = useTickets()
  const [creating, setCreating] = useState(false)
  const [busyTicketId, setBusyTicketId] = useState<number | null>(null)
  const [ticketError, setTicketError] = useState<string | null>(null)

  const handleCreateCustomer: Parameters<typeof CustomerForm>[0]['onSubmit'] =
    async (data) => {
      setCreating(true)
      try {
        await customers.create(data)
      } finally {
        setCreating(false)
      }
    }

  const handleCreateTicket = async (data: TicketCreate) => {
    setCreating(true)
    setTicketError(null)
    try {
      await tickets.create(data)
    } catch (err) {
      setTicketError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    } finally {
      setCreating(false)
    }
  }

  const handleStatusChange = async (id: number, status: TicketStatus) => {
    setBusyTicketId(id)
    setTicketError(null)
    try {
      await tickets.updateStatus(id, status)
    } catch (err) {
      setTicketError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setBusyTicketId(null)
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Gestión de Clientes y Tickets</h1>
        <nav className="tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'customers'}
            className={tab === 'customers' ? 'tab tab--active' : 'tab'}
            onClick={() => setTab('customers')}
          >
            Clientes
          </button>
          <button
            role="tab"
            aria-selected={tab === 'tickets'}
            className={tab === 'tickets' ? 'tab tab--active' : 'tab'}
            onClick={() => setTab('tickets')}
          >
            Tickets
          </button>
        </nav>
      </header>

      <main className="app__main">
        {tab === 'customers' ? (
          <section className="section">
            <CustomerForm onSubmit={handleCreateCustomer} busy={creating} />
            {customers.error && <p className="error">{customers.error}</p>}
            <h2>Listado</h2>
            {customers.loading ? (
              <p className="muted">Cargando…</p>
            ) : (
              <CustomerList customers={customers.customers} />
            )}
          </section>
        ) : (
          <section className="section">
            <TicketForm
              customers={customers.customers}
              busy={creating}
              onSubmit={handleCreateTicket}
            />
            {(ticketError || tickets.error) && (
              <p className="error">{ticketError ?? tickets.error}</p>
            )}
            <h2>Listado</h2>
            {tickets.loading ? (
              <p className="muted">Cargando…</p>
            ) : (
              <TicketList
                tickets={tickets.tickets}
                customers={customers.customers}
                busyId={busyTicketId}
                onStatusChange={handleStatusChange}
              />
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default App
