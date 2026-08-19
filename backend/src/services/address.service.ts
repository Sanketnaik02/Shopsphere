import prisma from '../lib/prisma'
import { ApiError } from '../utils/ApiError'
import { Prisma } from '@prisma/client'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type AddressResponse = {
  id: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

type CreateAddressInput = {
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

type UpdateAddressInput = {
  fullName?: string
  phone?: string
  addressLine1?: string
  addressLine2?: string | null
  city?: string
  state?: string
  postalCode?: string
  country?: string
  isDefault?: boolean
}

type AddressRecord = {
  id: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

function serializeAddress(address: AddressRecord): AddressResponse {
  return {
    id: address.id,
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    isDefault: address.isDefault,
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString(),
  }
}

function createData(input: CreateAddressInput) {
  return {
    fullName: input.fullName,
    phone: input.phone,
    addressLine1: input.addressLine1,
    addressLine2: input.addressLine2 ?? null,
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
    country: input.country,
  }
}

export async function listAddresses(userId: string): Promise<AddressResponse[]> {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  })
  return addresses.map((address) => serializeAddress(address as AddressRecord))
}

export async function getAddress(userId: string, id: string): Promise<AddressResponse> {
  if (!UUID_PATTERN.test(id)) {
    throw new ApiError(400, 'Invalid address UUID format', true, 'INVALID_ADDRESS_UUID')
  }

  const address = await prisma.address.findFirst({ where: { id, userId } })
  if (!address) {
    throw new ApiError(404, 'Address not found', true, 'ADDRESS_NOT_FOUND')
  }

  return serializeAddress(address as AddressRecord)
}

export async function createAddress(
  userId: string,
  input: CreateAddressInput,
): Promise<AddressResponse> {
  const makeDefault = input.isDefault ?? false

  if (makeDefault) {
    const [, created] = await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.address.create({
        data: { userId, ...createData(input), isDefault: true },
      }),
    ])
    return serializeAddress(created as AddressRecord)
  }

  const created = await prisma.address.create({
    data: { userId, ...createData(input), isDefault: false },
  })
  return serializeAddress(created as AddressRecord)
}

export async function updateAddress(
  userId: string,
  id: string,
  input: UpdateAddressInput,
): Promise<AddressResponse> {
  if (!UUID_PATTERN.test(id)) {
    throw new ApiError(400, 'Invalid address UUID format', true, 'INVALID_ADDRESS_UUID')
  }

  const existing = await prisma.address.findFirst({
    where: { id, userId },
    select: { id: true },
  })
  if (!existing) {
    throw new ApiError(404, 'Address not found', true, 'ADDRESS_NOT_FOUND')
  }

  const data: Prisma.AddressUpdateInput = {}
  if (input.fullName !== undefined) data.fullName = input.fullName
  if (input.phone !== undefined) data.phone = input.phone
  if (input.addressLine1 !== undefined) data.addressLine1 = input.addressLine1
  if (input.addressLine2 !== undefined) data.addressLine2 = input.addressLine2
  if (input.city !== undefined) data.city = input.city
  if (input.state !== undefined) data.state = input.state
  if (input.postalCode !== undefined) data.postalCode = input.postalCode
  if (input.country !== undefined) data.country = input.country
  if (input.isDefault !== undefined) data.isDefault = input.isDefault

  if (input.isDefault === true) {
    const [, updated] = await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId, id: { not: existing.id }, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.address.update({ where: { id: existing.id }, data }),
    ])
    return serializeAddress(updated as AddressRecord)
  }

  const updated = await prisma.address.update({ where: { id: existing.id }, data })
  return serializeAddress(updated as AddressRecord)
}

export async function deleteAddress(userId: string, id: string): Promise<void> {
  if (!UUID_PATTERN.test(id)) {
    throw new ApiError(400, 'Invalid address UUID format', true, 'INVALID_ADDRESS_UUID')
  }

  const existing = await prisma.address.findFirst({
    where: { id, userId },
    select: { id: true },
  })
  if (!existing) {
    throw new ApiError(404, 'Address not found', true, 'ADDRESS_NOT_FOUND')
  }

  await prisma.address.delete({ where: { id: existing.id } })
}