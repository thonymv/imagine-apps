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

export function StatusSelect({
  value,
  disabled,
  onChange,
}: StatusSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as TicketStatus)}
    >
      {TICKET_STATUSES.map((s) => (
        <option key={s} value={s}>
          {TICKET_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  )
}
