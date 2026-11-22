import { NextRequest, NextResponse } from "next/server";
import { DATASET, ZoneStatus, filterZones } from "@/lib/zones";

const VALID_STATUSES = new Set<ZoneStatus | "all">([
  "all",
  "aman",
  "kurang_aman",
  "tidak_aman",
]);

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawStatus = (searchParams.get("status") ?? "all").trim();
  const query = (searchParams.get("q") ?? "").slice(0, 100);

  if (!VALID_STATUSES.has(rawStatus as ZoneStatus | "all")) {
    return NextResponse.json(
      {
        error: "Invalid status parameter. Use all, aman, kurang_aman, or tidak_aman.",
      },
      { status: 400 }
    );
  }

  const zones = filterZones(
    DATASET.zones,
    rawStatus as ZoneStatus | "all",
    query
  );

  return NextResponse.json({
    metadata: DATASET.metadata,
    criteria: DATASET.criteria,
    count: zones.length,
    zones,
  });
}
