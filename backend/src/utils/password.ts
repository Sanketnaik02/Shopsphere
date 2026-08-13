import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export const hashPassword = (plainPassword: string): Promise<string> =>
  bcrypt.hash(plainPassword, SALT_ROUNDS)

export const verifyPassword = (plainPassword: string, passwordHash: string): Promise<boolean> =>
  bcrypt.compare(plainPassword, passwordHash)