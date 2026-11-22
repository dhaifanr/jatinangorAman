"use client";

import { useEffect } from "react";
import { Award, Home, Shield, X } from "lucide-react";
import {
  MapMode,
  ZoneData,
  formatDecimal,
  getLivingPalette,
  getOverallPalette,
  getStatusPalette,
} from "@/lib/zones";

interface CategoryBoardModalProps {
  zones: ZoneData[];
  selectedCode: string | null;
  onSelectZone: (code: string, mode?: MapMode) => void;
  onClose: () => void;
}

export default function CategoryBoardModal({
  zones,
  selectedCode,
  onSelectZone,
  onClose,
}: CategoryBoardModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const bySafety = [...zones].sort((a, b) => a.safetyRank - b.safetyRank);
  const byLiving = [...zones].sort((a, b) => a.livingRank - b.livingRank);
  const byOverall = [...zones].sort((a, b) => a.topsisRank - b.topsisRank);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-board-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4 text-white">
          <div>
            <h2 id="category-board-title" className="text-base font-bold">
              Komparasi 3 Kategori Daerah Kos Jatinangor (Paper v3)
            </h2>
            <p className="mt-0.5 text-xs text-slate-300">
              Klik salah satu daerah di kolom mana pun untuk menyorot zonanya di peta
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup matriks 3 kategori"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/80 text-slate-200 transition hover:bg-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Columns Body */}
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto bg-slate-50 p-4 lg:grid-cols-3 lg:p-5">
          {/* KOLOM 1: Daerah Paling Aman berdasarkan Kategori */}
          <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  1. Daerah Paling Aman
                </h3>
                <p className="text-[11px] text-slate-500">
                  Berdasarkan Kategori Keamanan (C4: CCTV/Portal &amp; Risiko)
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {bySafety.map((zone) => {
                const palette = getStatusPalette(zone.zoneStatus);
                const isSelected = selectedCode === zone.code;
                return (
                  <button
                    key={`safe-${zone.code}`}
                    type="button"
                    onClick={() => {
                      onSelectZone(zone.code, "keamanan");
                      onClose();
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900/10"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold text-white"
                        style={{ backgroundColor: palette.accentHex }}
                      >
                        #{zone.safetyRank}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-900">
                          {zone.code} - {zone.name.split(" (")[0]}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500">
                          Skor Keamanan C4:{" "}
                          <strong className="text-slate-800">
                            {formatDecimal(zone.metrics.c4_keamanan, 1)} / 5,0
                          </strong>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${palette.badgeBg} ${palette.badgeText}`}
                    >
                      {zone.zoneLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* KOLOM 2: Daerah Layak / Tidak Layak berdasarkan Kategori */}
          <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Home className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  2. Kelayakan Hunian (Layak / Tidak)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Berdasarkan Biaya (C1), Jarak (C2), Fasilitas (C3) &amp; Tenang (C5)
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {byLiving.map((zone) => {
                const palette = getLivingPalette(zone.livingStatus);
                const isSelected = selectedCode === zone.code;
                return (
                  <button
                    key={`liv-${zone.code}`}
                    type="button"
                    onClick={() => {
                      onSelectZone(zone.code, "kelayakan");
                      onClose();
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900/10"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold text-white"
                        style={{ backgroundColor: palette.accentHex }}
                      >
                        #{zone.livingRank}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-900">
                          {zone.code} - {zone.name.split(" (")[0]}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500">
                          Rp {formatDecimal(zone.metrics.c1_harga_juta)} jt |{" "}
                          {formatDecimal(zone.metrics.c2_jarak_km)} km | Li:{" "}
                          <strong className="text-slate-800">
                            {formatDecimal(zone.livingScore, 4)}
                          </strong>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${palette.badgeBg} ${palette.badgeText}`}
                    >
                      {zone.livingLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* KOLOM 3: Overall (Aman dan Layak) */}
          <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  3. Overall: Aman &amp; Layak
                </h3>
                <p className="text-[11px] text-slate-500">
                  Skor Gabungan AHP-TOPSIS (Vi) Seluruh 5 Kriteria
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {byOverall.map((zone) => {
                const palette = getOverallPalette(zone.overallStatus);
                const isSelected = selectedCode === zone.code;
                return (
                  <button
                    key={`ov-${zone.code}`}
                    type="button"
                    onClick={() => {
                      onSelectZone(zone.code, "overall");
                      onClose();
                    }}
                    className={`flex w-full flex-col gap-1.5 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900/10"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold text-white"
                          style={{ backgroundColor: palette.accentHex }}
                        >
                          #{zone.topsisRank}
                        </span>
                        <span className="truncate text-xs font-bold text-slate-900">
                          {zone.code} - {zone.name.split(" (")[0]}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${palette.badgeBg} ${palette.badgeText}`}
                      >
                        {zone.overallLabel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pl-8 text-[11px] text-slate-600">
                      <span>
                        Skor Vi:{" "}
                        <strong className="text-slate-900">
                          {formatDecimal(zone.topsisScore, 4)}
                        </strong>
                      </span>
                      <span>
                        C4: {formatDecimal(zone.metrics.c4_keamanan, 1)}/5 |{" "}
                        {zone.livingLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
