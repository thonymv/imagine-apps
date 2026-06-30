import { useState } from 'react'
import toast from 'react-hot-toast'

import { useCustomers } from './hooks/useCustomers'
import { useTickets } from './hooks/useTickets'
import { CustomerList } from './features/customers/CustomerList'
import { CustomerForm } from './features/customers/CustomerForm'
import { TicketList } from './features/tickets/TicketList'
import { TicketForm } from './features/tickets/TicketForm'
import { Layout, type View } from './components/Layout'
import { Modal } from './components/Modal'
import { Skeleton } from './components/Skeleton'
import type {
  CustomerCreate,
  TicketCreate,
  TicketStatus,
} from './api/types'

const titleByView: Record<View, string> = {
  customers: 'Clientes',
  tickets: 'Tickets',
}

function App() {
  const [view, setView] = useState<View>('customers')
  const [customerModal, setCustomerModal] = useState(false)
  const [ticketModal, setTicketModal] = useState(false)
  const [creating, setCreating] = useState(false)

  const customers = useCustomers()
  const tickets = useTickets()

  const handleCreateCustomer = async (data: CustomerCreate) => {
    setCreating(true)
    try {
      await customers.create(data)
      setCustomerModal(false)
      toast.success('Cliente creado correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear el cliente')
      throw err
    } finally {
      setCreating(false)
    }
  }

  const handleCreateTicket = async (data: TicketCreate) => {
    setCreating(true)
    try {
      await tickets.create(data)
      setTicketModal(false)
      toast.success('Ticket creado correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear el ticket')
      throw err
    } finally {
      setCreating(false)
    }
  }

  const handleStatusChange = async (id: number, status: TicketStatus) => {
    try {
      await tickets.updateStatus(id, status)
      toast.success('Estado actualizado')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al cambiar el estado')
    }
  }

  return (
    <Layout view={view} onViewChange={setView} title={titleByView[view]}>
      {view === 'customers' ? (
        <>
          {customers.loading ? (
            <div className="space-y-2">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : (
            <CustomerList
              customers={customers.customers}
              onNew={() => setCustomerModal(true)}
            />
          )}
          {customers.error && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {customers.error}
            </p>
          )}
          <Modal
            open={customerModal}
            title="Nuevo cliente"
            onClose={() => setCustomerModal(false)}
          >
            <CustomerForm
              busy={creating}
              onSubmit={handleCreateCustomer}
              onCancel={() => setCustomerModal(false)}
            />
          </Modal>
        </>
      ) : (
        <>
          {tickets.loading ? (
            <div className="space-y-2">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : (
            <TicketList
              tickets={tickets.tickets}
              customers={customers.customers}
              onNew={() => setTicketModal(true)}
              onStatusChange={handleStatusChange}
            />
          )}
          {(ticketModal && tickets.error) || tickets.error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {tickets.error}
            </p>
          ) : null}
          <Modal
            open={ticketModal}
            title="Nuevo ticket"
            onClose={() => setTicketModal(false)}
          >
            <TicketForm
              customers={customers.customers}
              busy={creating}
              onSubmit={handleCreateTicket}
              onCancel={() => setTicketModal(false)}
            />
          </Modal>
        </>
      )}
    </Layout>
  )
}

export default App
