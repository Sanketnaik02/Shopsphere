import { useEffect, useState, type FormEvent } from 'react'
import type { Address } from '../types/address'
import type { AddressInput } from '../api/addresses'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20'

export function AddressForm({
  open,
  address,
  submitting,
  error,
  onSubmit,
  onClose,
}: {
  open: boolean
  address: Address | null
  submitting: boolean
  error: string | null
  onSubmit: (values: AddressInput) => void
  onClose: () => void
}) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  useEffect(() => {
    if (!open) return
    setFullName(address?.fullName ?? '')
    setPhone(address?.phone ?? '')
    setAddressLine1(address?.addressLine1 ?? '')
    setAddressLine2(address?.addressLine2 ?? '')
    setCity(address?.city ?? '')
    setState(address?.state ?? '')
    setPostalCode(address?.postalCode ?? '')
    setCountry(address?.country ?? '')
    setIsDefault(address?.isDefault ?? false)
  }, [open, address])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      isDefault,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-form-title"
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 id="address-form-title" className="text-lg font-bold tracking-tight text-slate-900">
              {address ? 'Edit Address' : 'Add New Address'}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="address-fullName" className="mb-1 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="address-fullName"
                autoFocus
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address-phone" className="mb-1 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                id="address-phone"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="e.g. +919876543210"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address-line1" className="mb-1 block text-sm font-medium text-slate-700">
                Address Line 1
              </label>
              <input
                id="address-line1"
                required
                value={addressLine1}
                onChange={(event) => setAddressLine1(event.target.value)}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address-line2" className="mb-1 block text-sm font-medium text-slate-700">
                Address Line 2 <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                id="address-line2"
                value={addressLine2}
                onChange={(event) => setAddressLine2(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="address-city" className="mb-1 block text-sm font-medium text-slate-700">
                City
              </label>
              <input
                id="address-city"
                required
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="address-state" className="mb-1 block text-sm font-medium text-slate-700">
                State
              </label>
              <input
                id="address-state"
                required
                value={state}
                onChange={(event) => setState(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="address-postal-code" className="mb-1 block text-sm font-medium text-slate-700">
                Postal Code
              </label>
              <input
                id="address-postal-code"
                required
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="address-country" className="mb-1 block text-sm font-medium text-slate-700">
                Country
              </label>
              <input
                id="address-country"
                required
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="address-is-default"
                type="checkbox"
                checked={isDefault}
                onChange={(event) => setIsDefault(event.target.checked)}
                className="h-4 w-4 rounded accent-indigo-600"
              />
              <label htmlFor="address-is-default" className="text-sm font-medium text-slate-700">
                Set as default address
              </label>
            </div>
          </div>

          {error ? (
            <p role="alert" className="px-6 pb-2 text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              {submitting ? 'Saving…' : address ? 'Save Changes' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}