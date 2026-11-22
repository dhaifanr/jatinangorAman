import rawDataset from "../../data/kawasan_jatinangor.json";

export type ZoneStatus = "aman" | "kurang_aman" | "tidak_aman";
export type LivingStatus = "layak" | "cukup_layak" | "tidak_layak";
export type OverallStatus = "aman_dan_layak" | "kompromi" | "kurang_optimal";
export type MapMode = "keamanan" | "kelayakan" | "overall";
export type CategoryFilter =
  | "all"
  | ZoneStatus
  | LivingStatus
  | OverallStatus;

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
  safetyRank: number;
  livingStatus: LivingStatus;
  livingLabel: string;
  livingScore: number;
  livingRank: number;
  overallStatus: OverallStatus;
  overallLabel: string;
  overallVerdict: string;
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
  priceCalibration?: string;
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
    livingStatus: z.livingStatus as LivingStatus,
    overallStatus: z.overallStatus as OverallStatus,
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

const GREEN_PALETTE: ZoneVisualPalette = {
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
};

const AMBER_PALETTE: ZoneVisualPalette = {
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
};

const RED_PALETTE: ZoneVisualPalette = {
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
};

const STATUS_PALETTES: Record<ZoneStatus, ZoneVisualPalette> = {
  aman: GREEN_PALETTE,
  kurang_aman: AMBER_PALETTE,
  tidak_aman: RED_PALETTE,
};

const LIVING_PALETTES: Record<LivingStatus, ZoneVisualPalette> = {
  layak: GREEN_PALETTE,
  cukup_layak: AMBER_PALETTE,
  tidak_layak: RED_PALETTE,
};

const OVERALL_PALETTES: Record<OverallStatus, ZoneVisualPalette> = {
  aman_dan_layak: GREEN_PALETTE,
  kompromi: AMBER_PALETTE,
  kurang_optimal: RED_PALETTE,
};

export function getStatusPalette(status: ZoneStatus): ZoneVisualPalette {
  return STATUS_PALETTES[status];
}

export function getLivingPalette(status: LivingStatus): ZoneVisualPalette {
  return LIVING_PALETTES[status];
}

export function getOverallPalette(status: OverallStatus): ZoneVisualPalette {
  return OVERALL_PALETTES[status];
}

export function getZonePaletteByMode(
  zone: ZoneData,
  mode: MapMode
): ZoneVisualPalette {
  if (mode === "keamanan") return getStatusPalette(zone.zoneStatus);
  if (mode === "kelayakan") return getLivingPalette(zone.livingStatus);
  return getOverallPalette(zone.overallStatus);
}

export function getZoneBadgeLabelByMode(zone: ZoneData, mode: MapMode): string {
  if (mode === "keamanan") return zone.zoneLabel;
  if (mode === "kelayakan") return zone.livingLabel;
  return zone.overallLabel;
}

export function formatDecimal(value: number, digits = 2): string {
  return value.toFixed(digits).replace(".", ",");
}

export function filterAndSortZones(
  zones: ZoneData[],
  mode: MapMode,
  categoryFilter: CategoryFilter,
  query: string
): ZoneData[] {
  const normalized = query.trim().toLowerCase();
  const filtered = zones.filter((zone) => {
    if (categoryFilter !== "all") {
      if (mode === "keamanan" && zone.zoneStatus !== categoryFilter) {
        return false;
      }
      if (mode === "kelayakan" && zone.livingStatus !== categoryFilter) {
        return false;
      }
      if (mode === "overall" && zone.overallStatus !== categoryFilter) {
        return false;
      }
    }
    if (!normalized) return true;
    return (
      zone.name.toLowerCase().includes(normalized) ||
      zone.code.toLowerCase().includes(normalized) ||
      zone.zoneLabel.toLowerCase().includes(normalized) ||
      zone.livingLabel.toLowerCase().includes(normalized) ||
      zone.overallLabel.toLowerCase().includes(normalized)
    );
  });

  return filtered.sort((a, b) => {
    if (mode === "keamanan") return a.safetyRank - b.safetyRank;
    if (mode === "kelayakan") return a.livingRank - b.livingRank;
    return a.topsisRank - b.topsisRank;
  });
}

export function filterZones(
  zones: ZoneData[],
  statusFilter: ZoneStatus | "all",
  query: string
): ZoneData[] {
  return filterAndSortZones(zones, "keamanan", statusFilter, query);
}

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
