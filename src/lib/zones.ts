import rawDataset from "../../data/kawasan_jatinangor.json";

export type ZoneStatus = "aman" | "kurang_aman" | "tidak_aman";
export type MapMode = "keamanan" | "topsis";

export interface CriterionSpec {
  code: string;
  name: string;
  unit: string;
  type: "cost" | "benefit";
  ahpWeight: number;
}

export interface ZoneMetrics {
  c1_harga_juta: number;
  c2_jarak_km: number;
  c3_fasilitas: number;
  c4_keamanan: number;
  c5_kebisingan: number;
}

export interface ZoneData {
  code: string;
  name: string;
  zoneStatus: ZoneStatus;
  zoneLabel: string;
  topsisRank: number;
  topsisScore: number;
  dPlus: number;
  dMinus: number;
  metrics: ZoneMetrics;
  summary: string;
  centerApprox: {
    lat: number;
    lng: number;
  };
  polygon: [number, number][];
}

export interface CampusLandmark {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface DatasetMetadata {
  title: string;
  sourcePaper: string;
  method: string;
  consistencyRatio: number;
  sampleSize: number;
  isSimulated: boolean;
  note: string;
}

export interface JatinangorDataset {
  metadata: DatasetMetadata;
  criteria: CriterionSpec[];
  zones: ZoneData[];
}

export const JATINANGOR_CENTER: [number, number] = [-6.9315, 107.77];
export const JATINANGOR_DEFAULT_ZOOM = 15;

/**
 * Poligon pendekatan untuk masing-masing kawasan A1-A6 di koridor Jatinangor.
 * Koordinat poligon riil per unit kos akan diperhalus pada fase survei lapangan.
 */
const ZONE_POLYGONS: Record<string, [number, number][]> = {
  A1: [
    [-6.9278, 107.7695],
    [-6.9275, 107.7745],
    [-6.9312, 107.7752],
    [-6.9334, 107.7728],
    [-6.9328, 107.7692],
  ],
  A2: [
    [-6.9322, 107.7595],
    [-6.9318, 107.7658],
    [-6.9362, 107.7664],
    [-6.9378, 107.7618],
    [-6.9355, 107.7588],
  ],
  A3: [
    [-6.9362, 107.7702],
    [-6.9358, 107.7768],
    [-6.9415, 107.7774],
    [-6.9432, 107.7722],
    [-6.9405, 107.7696],
  ],
  A4: [
    [-6.9182, 107.7712],
    [-6.9178, 107.7782],
    [-6.9235, 107.7788],
    [-6.9255, 107.7742],
    [-6.9232, 107.7705],
  ],
  A5: [
    [-6.9248, 107.7645],
    [-6.9242, 107.7702],
    [-6.9296, 107.7708],
    [-6.9316, 107.7668],
    [-6.9292, 107.7638],
  ],
  A6: [
    [-6.9382, 107.7782],
    [-6.9378, 107.7848],
    [-6.9442, 107.7855],
    [-6.9458, 107.7804],
    [-6.9428, 107.7775],
  ],
};

export const CAMPUS_LANDMARKS: CampusLandmark[] = [
  { id: "unpad", name: "UNPAD Jatinangor", lat: -6.9261, lng: 107.7747 },
  { id: "itb", name: "ITB Jatinangor", lat: -6.9288, lng: 107.7692 },
  { id: "ipdn", name: "IPDN", lat: -6.9344, lng: 107.7666 },
  { id: "ikopin", name: "IKOPIN", lat: -6.9348, lng: 107.7778 },
];

export const DATASET: JatinangorDataset = {
  metadata: rawDataset.metadata,
  criteria: rawDataset.criteria as CriterionSpec[],
  zones: rawDataset.zones.map((z) => ({
    ...z,
    zoneStatus: z.zoneStatus as ZoneStatus,
    polygon: ZONE_POLYGONS[z.code] ?? [
      [z.centerApprox.lat + 0.0025, z.centerApprox.lng - 0.0025],
      [z.centerApprox.lat + 0.0025, z.centerApprox.lng + 0.0025],
      [z.centerApprox.lat - 0.0025, z.centerApprox.lng + 0.0025],
      [z.centerApprox.lat - 0.0025, z.centerApprox.lng - 0.0025],
    ],
  })),
};

export interface ZoneVisualPalette {
  stroke: string;
  fill: string;
  accentHex: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  headerGradient: string;
  bannerBg: string;
  bannerText: string;
  bannerBorder: string;
}

const STATUS_PALETTES: Record<ZoneStatus, ZoneVisualPalette> = {
  aman: {
    stroke: "#059669",
    fill: "#10B981",
    accentHex: "#10B981",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-300",
    headerGradient: "from-emerald-900 to-emerald-800",
    bannerBg: "bg-emerald-50",
    bannerText: "text-emerald-800",
    bannerBorder: "border-emerald-200",
  },
  kurang_aman: {
    stroke: "#D97706",
    fill: "#F59E0B",
    accentHex: "#F59E0B",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-300",
    headerGradient: "from-amber-800 to-amber-700",
    bannerBg: "bg-amber-50",
    bannerText: "text-amber-900",
    bannerBorder: "border-amber-200",
  },
  tidak_aman: {
    stroke: "#DC2626",
    fill: "#EF4444",
    accentHex: "#EF4444",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
    badgeBorder: "border-red-300",
    headerGradient: "from-red-900 to-red-800",
    bannerBg: "bg-red-50",
    bannerText: "text-red-900",
    bannerBorder: "border-red-200",
  },
};

export function getStatusPalette(status: ZoneStatus): ZoneVisualPalette {
  return STATUS_PALETTES[status];
}

export function getTopsisPalette(rank: number): { stroke: string; fill: string; textHex: string } {
  if (rank <= 2) {
    return { stroke: "#4338CA", fill: "#6366F1", textHex: "#312E81" };
  }
  if (rank <= 4) {
    return { stroke: "#0284C7", fill: "#38BDF8", textHex: "#075985" };
  }
  return { stroke: "#64748B", fill: "#94A3B8", textHex: "#334155" };
}

export function formatDecimal(value: number, digits = 2): string {
  return value.toFixed(digits).replace(".", ",");
}

export function filterZones(
  zones: ZoneData[],
  statusFilter: ZoneStatus | "all",
  query: string
): ZoneData[] {
  const normalized = query.trim().toLowerCase();
  return zones.filter((zone) => {
    const matchesStatus = statusFilter === "all" || zone.zoneStatus === statusFilter;
    if (!matchesStatus) return false;
    if (!normalized) return true;
    return (
      zone.name.toLowerCase().includes(normalized) ||
      zone.code.toLowerCase().includes(normalized) ||
      zone.zoneLabel.toLowerCase().includes(normalized)
    );
  });
}

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
