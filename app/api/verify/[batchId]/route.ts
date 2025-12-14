export const runtime = "nodejs"

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database"; // adjust path if needed

export async function GET(
  req: Request,
  { params }: { params: { batchId: string } }
) {
  const { batchId } = params;

  try {
    const db = await connectToDatabase();

    // Find the batch by its ID
    const batch = await db.collection("batches").findOne({ id: batchId });

    if (!batch) {
      return NextResponse.json(
        { error: "Batch not found", batchId },
        { status: 404 }
      );
    }

    return NextResponse.json(batch);
  } catch (error) {
    console.error("Error fetching batch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
