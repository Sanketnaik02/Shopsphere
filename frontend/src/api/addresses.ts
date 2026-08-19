import { apiRequest } from '../lib/api'
import type { Address } from '../types/address'

export type AddressInput = {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}

interface AddressesEnvelope {
  addresses: Address[]
}

interface AddressEnvelope {
  address: Address
}

export async function getAddresses(): Promise<Address[]> {
  const data = await apiRequest<AddressesEnvelope>('/addresses')
  return data.addresses
}

export async function getAddressById(id: string): Promise<Address> {
  const data = await apiRequest<AddressEnvelope>(`/addresses/${encodeURIComponent(id)}`)
  return data.address
}

export async function createAddress(input: AddressInput): Promise<Address> {
  const data = await apiRequest<AddressEnvelope>('/addresses', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return data.address
}

export async function updateAddress(id: string, input: Partial<AddressInput>): Promise<Address> {
  const data = await apiRequest<AddressEnvelope>(`/addresses/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
  return data.address
}

export async function deleteAddress(id: string): Promise<void> {
  await apiRequest<{ deleted: boolean }>(`/addresses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}