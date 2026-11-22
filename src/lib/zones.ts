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

export const JATINANGOR_CENTER: [number, number] = [-6.9338, 107.773];
export const JATINANGOR_DEFAULT_ZOOM = 15;

/**
 * Poligon terverifikasi berdasarkan geometri jalan OpenStreetMap Jatinangor:
 * - A1 Ciseke: Gang Ciseke (-6.9329..-6.9352, 107.7750..107.7774), selatan Gerbang Lama Unpad
 * - A2 GKPN & Kolocokro: Jalan GKPN (-6.9351..-6.9412, 107.7626..107.7678), seberang IPDN/Ikopin
 * - A3 Sayang: Koridor Jalan Sayang / Jl. Kol. Ahmad Syam (-6.9366..-6.9452, 107.7715..107.7752)
 * - A4 Cikuda: Jalan Cikuda (-6.9230..-6.9296, 107.7778..107.7832), timur/timur-laut Unpad
 * - A5 Hegarmanah: Jalan Hegarmanah (-6.9312..-6.9396, 107.7778..107.7832), timur Ciseke
 * - A6 Caringin: Jalan Caringin & Ci Caringin (-6.9340..-6.9445, 107.7682..107.7712), antara GKPN & Sayang
 */
const ZONE_POLYGONS: Record<string, [number, number][]> = {
  A1: [
    [-6.9322, 107.7738],
    [-6.9318, 107.7774],
    [-6.9358, 107.7774],
    [-6.9362, 107.7742],
    [-6.9342, 107.7736],
  ],
  A2: [
    [-6.9351, 107.7635],
    [-6.9348, 107.7678],
    [-6.9395, 107.7678],
    [-6.9412, 107.7642],
    [-6.9382, 107.7626],
  ],
  A3: [
    [-6.9368, 107.7716],
    [-6.9366, 107.7752],
    [-6.9445, 107.7750],
    [-6.9452, 107.7715],
    [-6.9408, 107.7715],
  ],
  A4: [
    [-6.9232, 107.7778],
    [-6.9230, 107.7825],
    [-6.9285, 107.7832],
    [-6.9296, 107.7795],
    [-6.9268, 107.7778],
  ],
  A5: [
    [-6.9315, 107.7778],
    [-6.9312, 107.7828],
    [-6.9388, 107.7832],
    [-6.9396, 107.7782],
    [-6.9356, 107.7778],
  ],
  A6: [
    [-6.9344, 107.7682],
    [-6.9340, 107.7712],
    [-6.9432, 107.7710],
    [-6.9445, 107.7682],
    [-6.9395, 107.7682],
  ],
};

export const CAMPUS_LANDMARKS: CampusLandmark[] = [
  { id: "unpad", name: "UNPAD Jatinangor", lat: -6.9245, lng: 107.774 },
  { id: "itb", name: "ITB Jatinangor", lat: -6.9289, lng: 107.7689 },
  { id: "ikopin", name: "IKOPIN", lat: -6.9332, lng: 107.7665 },
  { id: "ipdn", name: "IPDN", lat: -6.9315, lng: 107.7632 },
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
