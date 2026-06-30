import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  type LucideIcon,
} from 'lucide-react'

import {
  TICKET_STATUSES,
  TICKET_STATUS_LABEL,
  type TicketStatus,
} from '../api/types'
import { StatusBadge } from './StatusBadge'

const iconByStatus: Record<TicketStatus, LucideIcon> = {
  pendiente: Circle,
  en_progreso: Clock,
  finalizado: CheckCircle2,
}

const iconClassByStatus: Record<TicketStatus, string> = {
  pendiente: 'text-amber-500',
  en_progreso: 'text-blue-500',
  finalizado: 'text-emerald-500',
}

interface StatusMenuProps {
  value: TicketStatus
  onChange: (status: TicketStatus) => void
}

export function StatusMenu({ value, onChange }: StatusMenuProps) {
  return (
    <Menu>
      <MenuButton className="inline-flex items-center gap-1 rounded-md p-0.5 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-brand-500">
        <StatusBadge status={value} />
        <ChevronDown
          className="h-3 w-3 text-neutral-400 transition group-data-[open]:rotate-180"
          aria-hidden="true"
        />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        transition
        className="z-50 w-52 origin-top-right rounded-lg border border-neutral-200 bg-white p-1 shadow-lg transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Cambiar estado
        </div>
        {TICKET_STATUSES.map((s) => {
          const Icon = iconByStatus[s]
          const isActive = s === value
          return (
            <MenuItem key={s}>
              <button
                type="button"
                onClick={() => onChange(s)}
                className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-700 data-[focus]:bg-neutral-100 dark:text-neutral-200 dark:data-[focus]:bg-neutral-800"
              >
                <Icon
                  className={`h-4 w-4 ${iconClassByStatus[s]}`}
                  aria-hidden="true"
                />
                <span className="flex-1 text-left">
                  {TICKET_STATUS_LABEL[s]}
                </span>
                {isActive && (
                  <Check
                    className="h-4 w-4 text-brand-600 dark:text-brand-400"
                    aria-label="Estado actual"
                  />
                )}
              </button>
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}
