// Authentication utilities
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "herbchain-secret-key"

export interface TokenPayload {
  userId: string
  email: string
  role: "farmer" | "manufacturer" | "distributor" | "regulator"
}

export async function verifyToken(token: string | null): Promise<TokenPayload | null> {
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}
