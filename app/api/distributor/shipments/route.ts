export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = await verifyToken(token)

    if (!user || user.role !== "distributor") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get all shipments for this distributor
    const collection = await DatabaseOperations.getCollection("shipment_records")
    const shipments = await collection.find({ distributor_id: user.userId }).toArray()

    const responseData = shipments.map((shipment) => ({
      _id: shipment._id,
      shipmentId: shipment.id,
      batchId: shipment.batch_id,
      destination: shipment.destination_location.address,
      transportMode: "truck", // Default
      estimatedDelivery: shipment.expected_delivery,
      status: "in-transit", // Default
      currentLocation: `${shipment.origin_location.latitude}, ${shipment.origin_location.longitude}`,
      createdAt: shipment.created_at,
      updatedAt: shipment.created_at,
    }))

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error("Get shipments error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
