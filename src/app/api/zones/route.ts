import { NextRequest, NextResponse } from "next/server";
import {
  CategoryFilter,
  DATASET,
  MapMode,
  filterAndSortZones,
} from "@/lib/zones";

const VALID_MODES = new Set<MapMode>(["keamanan", "kelayakan", "overall"]);
const VALID_FILTERS = new Set<CategoryFilter>([
  "all",
  "aman",
  "kurang_aman",
  "tidak_aman",
  "layak",
  "cukup_layak",
  "tidak_layak",
  "aman_dan_layak",
  "kompromi",
  "kurang_optimal",
]);

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawMode = (searchParams.get("mode") ?? "keamanan").trim();
  const rawStatus = (searchParams.get("status") ?? "all").trim();
  const query = (searchParams.get("q") ?? "").slice(0, 100);

  if (!VALID_MODES.has(rawMode as MapMode)) {
    return NextResponse.json(
      { error: "Invalid mode parameter. Use keamanan, kelayakan, or overall." },
      { status: 400 }
    );
  }

  if (!VALID_FILTERS.has(rawStatus as CategoryFilter)) {
    return NextResponse.json(
      { error: "Invalid status filter parameter." },
      { status: 400 }
    );
  }

  const zones = filterAndSortZones(
    DATASET.zones,
    rawMode as MapMode,
    rawStatus as CategoryFilter,
    query
  );

  return NextResponse.json({
    metadata: DATASET.metadata,
    criteria: DATASET.criteria,
    mode: rawMode,
    count: zones.length,
    zones,
  });
}
