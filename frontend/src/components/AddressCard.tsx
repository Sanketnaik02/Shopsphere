import type { Address } from '../types/address'

export function AddressCard({
  address,
  selected,
  disabled,
  deleting,
  onSelect,
  onEdit,
  onDelete,
}: {
  address: Address
  selected: boolean
  disabled: boolean
  deleting: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div
      data-testid="address-card"
      className={`rounded-xl border bg-white shadow-sm transition-colors ${
        selected
          ? 'border-indigo-400 ring-2 ring-indigo-600/20'
          : 'border-slate-200'
      }`}
    >
      <label className="block cursor-pointer p-5">
        <span className="flex items-start gap-3">
          <input
            type="radio"
            name="selected-address"
            data-testid="select-address"
            aria-label={`Ship to ${address.fullName}, ${address.city}`}
            checked={selected}
            onChange={onSelect}
            disabled={disabled}
            className="mt-1 h-4 w-4 shrink-0 accent-indigo-600"
          />
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-900">{address.fullName}</span>
              {address.isDefault ? (
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                  Default
                </span>
              ) : null}
            </span>
            <span className="mt-0.5 block text-sm text-slate-500">{address.phone}</span>
            <address className="mt-1 block text-sm not-italic leading-relaxed text-slate-600">
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ''}
              <br />
              {address.city}, {address.state} {address.postalCode}
              <br />
              {address.country}
            </address>
          </span>
        </span>
      </label>
      <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3">
        <button
          type="button"
          data-testid="edit-address"
          onClick={onEdit}
          disabled={disabled}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          Edit
        </button>
        <button
          type="button"
          data-testid="delete-address"
          onClick={onDelete}
          disabled={disabled || deleting}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}