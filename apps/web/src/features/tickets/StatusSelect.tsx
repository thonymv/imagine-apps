import {
  TICKET_STATUSES,
  TICKET_STATUS_LABEL,
  type TicketStatus,
} from '../../api/types'

interface StatusSelectProps {
  value: TicketStatus
  disabled?: boolean
  onChange: (status: TicketStatus) => void
}

export function StatusSelect({ value, disabled, onChange }: StatusSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as TicketStatus)}
      aria-label="Cambiar estado"
      className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
    >
      {TICKET_STATUSES.map((s) => (
        <option key={s} value={s}>
          {TICKET_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  )
}
