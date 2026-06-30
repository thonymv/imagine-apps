import type { Customer } from '../../api/types'

export function CustomerList({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return <p className="muted">No hay clientes registrados.</p>
  }
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Empresa</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.name}</td>
            <td>{c.email}</td>
            <td>{c.company ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
