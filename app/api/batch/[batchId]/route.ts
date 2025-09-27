import { NextRequest, NextResponse } from "next/server";
import { DatabaseOperations } from "@/lib/database";

export async function GET(
  req: NextRequest,
  { params }: { params: { batchId: string } }
) {
  const { batchId } = params;

  try {
    const batch = await DatabaseOperations.getBatchById(batchId);

    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json(batch);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
