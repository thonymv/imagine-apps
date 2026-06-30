import { useState } from 'react'
import './App.css'

type Tab = 'customers' | 'tickets'

function App() {
  const [tab, setTab] = useState<Tab>('customers')

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
          <section className="placeholder">
            <p>Listado y registro de clientes (próximamente).</p>
          </section>
        ) : (
          <section className="placeholder">
            <p>Listado, creación y cambio de estado de tickets (próximamente).</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
