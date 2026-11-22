"use client";

import { AlertTriangle, Shield, X } from "lucide-react";
import {
  CriterionSpec,
  ZoneData,
  formatDecimal,
  getStatusPalette,
} from "@/lib/zones";

interface ZoneDetailDrawerProps {
  zone: ZoneData;
  allZones: ZoneData[];
  criteria: CriterionSpec[];
  onClose: () => void;
  onSelectZone: (code: string) => void;
}

const STATUS_SUBTITLES: Record<ZoneData["zoneStatus"], string> = {
  aman: "ZONA AMAN - DIREKOMENDASIKAN UNTUK HUNIAN",
  kurang_aman: "ZONA KURANG AMAN - PERLU KEWASPADAAN",
  tidak_aman: "ZONA TIDAK AMAN - KEWASPADAAN TINGGI",
};

export default function ZoneDetailDrawer({
  zone,
  allZones,
  criteria,
  onClose,
  onSelectZone,
}: ZoneDetailDrawerProps) {
  const palette = getStatusPalette(zone.zoneStatus);

  const sortedByTopsis = [...allZones].sort(
    (a, b) => a.topsisRank - b.topsisRank
  );

  const criteriaRows = [
    {
      spec: criteria[0],
      valueText: `Rp ${formatDecimal(zone.metrics.c1_harga_juta)} jt/thn`,
      percent: Math.min(100, Math.round((zone.metrics.c1_harga_juta / 11) * 100)),
      barColor: "bg-slate-600",
      valueColor: "text-slate-900",
    },
    {
      spec: criteria[1],
      valueText: `${formatDecimal(zone.metrics.c2_jarak_km)} km`,
      percent: Math.min(100, Math.round((zone.metrics.c2_jarak_km / 2.4) * 100)),
      barColor: zone.metrics.c2_jarak_km <= 0.8 ? "bg-emerald-500" : "bg-slate-500",
      valueColor:
        zone.metrics.c2_jarak_km <= 0.8 ? "text-emerald-700" : "text-slate-900",
    },
    {
      spec: criteria[2],
      valueText: `${formatDecimal(zone.metrics.c3_fasilitas, 1)} / 5,0`,
      percent: Math.round((zone.metrics.c3_fasilitas / 5) * 100),
      barColor: "bg-blue-500",
      valueColor: "text-slate-900",
    },
    {
      spec: criteria[3],
      valueText: `${formatDecimal(zone.metrics.c4_keamanan, 1)} / 5,0`,
      percent: Math.round((zone.metrics.c4_keamanan / 5) * 100),
      barColor:
        zone.zoneStatus === "aman"
          ? "bg-emerald-500"
          : zone.zoneStatus === "kurang_aman"
          ? "bg-amber-500"
          : "bg-red-500",
      valueColor:
        zone.zoneStatus === "aman"
          ? "text-emerald-700"
          : zone.zoneStatus === "kurang_aman"
          ? "text-amber-700"
          : "text-red-700",
    },
    {
      spec: criteria[4],
      valueText: `${formatDecimal(zone.metrics.c5_kebisingan, 1)} / 5,0`,
      percent: Math.round((zone.metrics.c5_kebisingan / 5) * 100),
      barColor:
        zone.metrics.c5_kebisingan >= 3.2 ? "bg-amber-500" : "bg-indigo-500",
      valueColor:
        zone.metrics.c5_kebisingan >= 3.2 ? "text-amber-700" : "text-slate-900",
    },
  ];

  return (
    <aside
      aria-label={`Detail kawasan ${zone.name}`}
      className="fixed bottom-0 left-0 right-0 z-30 flex max-h-[62vh] flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl lg:bottom-5 lg:left-auto lg:right-5 lg:top-5 lg:max-h-none lg:w-[408px] lg:rounded-2xl"
    >
      {/* Mobile Drag Handle */}
      <div className={`bg-gradient-to-r ${palette.headerGradient} px-5 pb-4 pt-3 text-white lg:pt-4`}>
        <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-white/40 lg:hidden" />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex shrink-0 items-center rounded-lg bg-white/20 px-2 py-1 text-xs font-extrabold tracking-wide text-white">
              {zone.code}
            </span>
            <h2 className="truncate text-base font-bold text-white lg:text-[17px]">
              {zone.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel detail kawasan"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/25 bg-white/15 text-white transition hover:bg-white/25 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-white/90">
          <Shield className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{STATUS_SUBTITLES[zone.zoneStatus]}</span>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 space-y-3.5 overflow-y-auto p-4 lg:p-5">
        {/* 2x2 KPI Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            className={`rounded-xl border p-3 ${palette.bannerBg} ${palette.bannerBorder}`}
          >
            <p className={`text-[10px] font-semibold ${palette.bannerText}`}>
              Skor Keamanan (C4)
            </p>
            <p className={`mt-0.5 text-lg font-extrabold ${palette.bannerText}`}>
              {formatDecimal(zone.metrics.c4_keamanan, 1)} / 5,0
            </p>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3">
            <p className="text-[10px] font-semibold text-indigo-800">
              Skor TOPSIS (Vi)
            </p>
            <p className="mt-0.5 text-lg font-extrabold text-indigo-950">
              {formatDecimal(zone.topsisScore, 4)}{" "}
              <span className="text-xs font-bold text-indigo-700">
                (#{zone.topsisRank})
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <p className="text-[10px] font-semibold text-slate-500">
              Harga Sewa (C1)
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-900">
              Rp {formatDecimal(zone.metrics.c1_harga_juta)} jt/thn
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5">
            <p className="text-[10px] font-semibold text-emerald-800">
              Jarak Kampus (C2)
            </p>
            <p className="mt-0.5 text-sm font-bold text-emerald-800">
              {formatDecimal(zone.metrics.c2_jarak_km)} km
            </p>
          </div>
        </div>

        {/* 5 Weighted Criteria Bars */}
        <div>
          <p className="mb-2 text-[10px] font-bold tracking-wider text-slate-500">
            RINCIAN 5 KRITERIA AHP-TOPSIS
          </p>
          <div className="space-y-2">
            {criteriaRows.map(({ spec, valueText, percent, barColor, valueColor }) => (
              <div key={spec.code} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-700">
                    {spec.code} {spec.name.split(" (")[0]} (
                    {Math.round(spec.ahpWeight * 100)}% |{" "}
                    {spec.type === "benefit" ? "Benefit" : "Cost"})
                  </span>
                  <span className={`font-bold ${valueColor}`}>{valueText}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Comparison Bar Chart (6 Zones) */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-[11px] font-bold text-slate-900">
            Perbandingan Skor TOPSIS (Vi) - 6 Kawasan
          </p>
          <div className="space-y-1.5">
            {sortedByTopsis.map((item) => {
              const isCurrent = item.code === zone.code;
              const widthPct = Math.round(item.topsisScore * 100);
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => onSelectZone(item.code)}
                  className="flex w-full items-center gap-2 text-left text-[10px] cursor-pointer hover:opacity-90"
                >
                  <span
                    className={`w-28 shrink-0 truncate ${
                      isCurrent
                        ? "font-bold text-slate-950"
                        : "font-medium text-slate-600"
                    }`}
                  >
                    #{item.topsisRank} {item.code} {item.name.split(" (")[0]}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: isCurrent
                          ? palette.accentHex
                          : "#94A3B8",
                      }}
                    />
                  </div>
                  <span
                    className={`w-11 shrink-0 text-right tabular-nums ${
                      isCurrent
                        ? "font-bold text-slate-950"
                        : "font-semibold text-slate-600"
                    }`}
                  >
                    {formatDecimal(item.topsisScore, 4)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile & Trade-off Callout */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-700" />
            <span>Profil & Catatan Model (Paper)</span>
          </div>
          <p className="mt-1 text-[11.5px] leading-relaxed text-amber-950">
            {zone.summary}
          </p>
        </div>
      </div>
    </aside>
  );
}
