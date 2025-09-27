import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { DatabaseOperations } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "herbchain-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name, role, phone, address, aadhaarId, licenseNumber } = await request.json()

    if (action === "login") {
      const user = await DatabaseOperations.getUserByEmail(email)

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      )

      return NextResponse.json({
        success: true,
        data: {
          token,
          user: {
            _id: user.id,
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.created_at,
          },
        },
      })
    }

    if (action === "register") {
      const existingUser = await DatabaseOperations.getUserByEmail(email)
      if (existingUser) {
        return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const newUser = await DatabaseOperations.createUser({
        id: userId,
        email,
        password_hash: hashedPassword,
        role,
        name,
        phone,
        address,
        aadhaar_id: aadhaarId,
        license_number: licenseNumber,
        created_at: new Date(),
        updated_at: new Date(),
      })

      const token = jwt.sign(
        {
          userId,
          email,
          role,
          name,
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      )

      return NextResponse.json({
        success: true,
        data: {
          token,
          user: { _id: userId, id: userId, email, name, role, createdAt: new Date() },
        },
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
