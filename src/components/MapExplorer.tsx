"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import {
  Columns3,
  Home,
  Info,
  List,
  Minus,
  Plus,
  Search,
  Shield,
  X,
} from "lucide-react";
import {
  CategoryFilter,
  JatinangorDataset,
  MapMode,
  filterAndSortZones,
  formatDecimal,
  getZoneBadgeLabelByMode,
  getZonePaletteByMode,
} from "@/lib/zones";
import type { MapActions } from "./JatinangorMap";
import ZoneDetailDrawer from "./ZoneDetailDrawer";
import MethodologyModal from "./MethodologyModal";
import CategoryBoardModal from "./CategoryBoardModal";

const JatinangorMap = dynamic(() => import("./JatinangorMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#E7EDF4] text-sm font-semibold text-slate-500">
      Memuat peta interaktif Jatinangor...
    </div>
  ),
});

interface MapExplorerProps {
  dataset: JatinangorDataset;
}

export default function MapExplorer({ dataset }: MapExplorerProps) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>("keamanan");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCategoryBoard, setShowCategoryBoard] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);

  const mapActionsRef = useRef<MapActions | null>(null);

  const handleModeChange = (nextMode: MapMode) => {
    setMapMode(nextMode);
    setCategoryFilter("all");
  };

  const modeFilterChips = useMemo(() => {
    const zones = dataset.zones;
    if (mapMode === "keamanan") {
      return [
        {
          key: "all" as CategoryFilter,
          label: `Semua (${zones.length})`,
          active: "bg-slate-900 text-white border-slate-900",
          idle: "bg-slate-50 text-slate-700 border-slate-200",
        },
        {
          key: "aman" as CategoryFilter,
          label: `Aman (${zones.filter((z) => z.zoneStatus === "aman").length})`,
          active: "bg-emerald-600 text-white border-emerald-600",
          idle: "bg-emerald-50 text-emerald-800 border-emerald-200",
        },
        {
          key: "kurang_aman" as CategoryFilter,
          label: `Kurang (${
            zones.filter((z) => z.zoneStatus === "kurang_aman").length
          })`,
          active: "bg-amber-500 text-white border-amber-500",
          idle: "bg-amber-50 text-amber-800 border-amber-200",
        },
        {
          key: "tidak_aman" as CategoryFilter,
          label: `Tidak (${
            zones.filter((z) => z.zoneStatus === "tidak_aman").length
          })`,
          active: "bg-red-600 text-white border-red-600",
          idle: "bg-red-50 text-red-800 border-red-200",
        },
      ];
    }

    if (mapMode === "kelayakan") {
      return [
        {
          key: "all" as CategoryFilter,
          label: `Semua (${zones.length})`,
          active: "bg-slate-900 text-white border-slate-900",
          idle: "bg-slate-50 text-slate-700 border-slate-200",
        },
        {
          key: "layak" as CategoryFilter,
          label: `Layak (${
            zones.filter((z) => z.livingStatus === "layak").length
          })`,
          active: "bg-emerald-600 text-white border-emerald-600",
          idle: "bg-emerald-50 text-emerald-800 border-emerald-200",
        },
        {
          key: "cukup_layak" as CategoryFilter,
          label: `Cukup (${
            zones.filter((z) => z.livingStatus === "cukup_layak").length
          })`,
          active: "bg-amber-500 text-white border-amber-500",
          idle: "bg-amber-50 text-amber-800 border-amber-200",
        },
        {
          key: "tidak_layak" as CategoryFilter,
          label: `Tidak Layak (${
            zones.filter((z) => z.livingStatus === "tidak_layak").length
          })`,
          active: "bg-red-600 text-white border-red-600",
          idle: "bg-red-50 text-red-800 border-red-200",
        },
      ];
    }

    return [
      {
        key: "all" as CategoryFilter,
        label: `Semua (${zones.length})`,
        active: "bg-slate-900 text-white border-slate-900",
        idle: "bg-slate-50 text-slate-700 border-slate-200",
      },
      {
        key: "aman_dan_layak" as CategoryFilter,
        label: `Aman & Layak (${
          zones.filter((z) => z.overallStatus === "aman_dan_layak").length
        })`,
        active: "bg-emerald-600 text-white border-emerald-600",
        idle: "bg-emerald-50 text-emerald-800 border-emerald-200",
      },
      {
        key: "kompromi" as CategoryFilter,
        label: `Kompromi (${
          zones.filter((z) => z.overallStatus === "kompromi").length
        })`,
        active: "bg-amber-500 text-white border-amber-500",
        idle: "bg-amber-50 text-amber-800 border-amber-200",
      },
      {
        key: "kurang_optimal" as CategoryFilter,
        label: `Kurang Optimal (${
          zones.filter((z) => z.overallStatus === "kurang_optimal").length
        })`,
        active: "bg-red-600 text-white border-red-600",
        idle: "bg-red-50 text-red-800 border-red-200",
      },
    ];
  }, [dataset.zones, mapMode]);

  const filteredZones = useMemo(
    () =>
      filterAndSortZones(dataset.zones, mapMode, categoryFilter, searchQuery),
    [dataset.zones, mapMode, categoryFilter, searchQuery]
  );

  const selectedZone = useMemo(
    () => dataset.zones.find((z) => z.code === selectedCode) ?? null,
    [dataset.zones, selectedCode]
  );

  const handleSelectZone = (code: string, targetMode?: MapMode) => {
    if (targetMode && targetMode !== mapMode) {
      setMapMode(targetMode);
      setCategoryFilter("all");
    }
    setSelectedCode(code);
    setShowMobileList(false);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#E7EDF4]">
      {/* Fullscreen Interactive Leaflet Map */}
      <JatinangorMap
        zones={filteredZones}
        selectedZone={selectedZone}
        mapMode={mapMode}
        onSelectZone={(code) => handleSelectZone(code)}
        mapActionsRef={mapActionsRef}
      />

      {/* DESKTOP: Floating Left Control Panel */}
      <aside
        aria-label="Panel kontrol dan daftar kawasan"
        className="pointer-events-auto fixed bottom-5 left-5 top-5 z-20 hidden w-[384px] flex-col overflow-hidden rounded-[18px] border border-slate-300 bg-white shadow-2xl lg:flex"
      >
        {/* Dark Navy Gradient Hero Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-[18px] pb-3.5 pt-[18px]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-[17px] font-bold leading-tight text-white">
                  JatinangorAman
                </h1>
                <p className="text-[11px] font-medium text-slate-400">
                  Smart Living &amp; Safety | Paper v5
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              aria-label="Informasi metodologi DSS"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/80 text-slate-200 transition hover:bg-slate-600 cursor-pointer"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>

          {/* CTA Button to Open 3-Column Comparison Board */}
          <button
            type="button"
            onClick={() => setShowCategoryBoard(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/25 cursor-pointer"
          >
            <Columns3 className="h-4 w-4" />
            <span>Lihat 3 Kolom: Paling Aman | Layak | Overall</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kawasan (Ciseke, Cikuda, GKPN...)"
              aria-label="Cari kawasan di Jatinangor"
              className="h-9.5 w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-8 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Bersihkan pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {modeFilterChips.map((chip) => {
              const isSelected = categoryFilter === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => setCategoryFilter(chip.key)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                    isSelected ? chip.active : chip.idle
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {mapMode === "keamanan"
              ? "URUTAN DAERAH PALING AMAN (SKOR C4)"
              : mapMode === "kelayakan"
              ? "URUTAN KELAYAKAN HUNIAN (LAYAK / TIDAK)"
              : "URUTAN OVERALL: AMAN & LAYAK (AHP-TOPSIS Vi)"}
          </p>

          {/* Kawasan Cards List */}
          <div className="mt-2 flex-1 space-y-2 overflow-y-auto pr-0.5">
            {filteredZones.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500">
                Kawasan tidak ditemukan.
              </div>
            ) : (
              filteredZones.map((zone) => {
                const palette = getZonePaletteByMode(zone, mapMode);
                const badgeLabel = getZoneBadgeLabelByMode(zone, mapMode);
                const isSelected = selectedCode === zone.code;

                const rankNumber =
                  mapMode === "keamanan"
                    ? zone.safetyRank
                    : mapMode === "kelayakan"
                    ? zone.livingRank
                    : zone.topsisRank;

                const barPct =
                  mapMode === "keamanan"
                    ? Math.round((zone.metrics.c4_keamanan / 5) * 100)
                    : mapMode === "kelayakan"
                    ? Math.round(zone.livingScore * 100)
                    : Math.round(zone.topsisScore * 100);

                const barText =
                  mapMode === "keamanan"
                    ? `Keamanan C4: ${formatDecimal(zone.metrics.c4_keamanan, 1)}/5`
                    : mapMode === "kelayakan"
                    ? `Skor Kelayakan Li: ${formatDecimal(zone.livingScore, 4)}`
                    : `Skor Overall Vi: ${formatDecimal(zone.topsisScore, 4)}`;

                return (
                  <button
                    key={zone.code}
                    type="button"
                    onClick={() => handleSelectZone(zone.code)}
                    className={`flex w-full overflow-hidden rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900/15"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <span
                      className="w-1.5 shrink-0"
                      style={{ backgroundColor: palette.accentHex }}
                    />
                    <div className="flex-1 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-bold text-slate-900">
                          #{rankNumber} {zone.code} - {zone.name.split(" (")[0]}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${palette.badgeBg} ${palette.badgeText}`}
                        >
                          {badgeLabel}
                        </span>
                      </div>

                      <p className="mt-0.5 text-[11px] font-medium text-slate-600">
                        Rp {formatDecimal(zone.metrics.c1_harga_juta)} jt/thn |{" "}
                        {formatDecimal(zone.metrics.c2_jarak_km)} km |{" "}
                        {zone.zoneLabel} | {zone.livingLabel}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold text-slate-700">
                          {barText}
                        </span>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${barPct}%`,
                              backgroundColor: palette.accentHex,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-semibold leading-snug text-slate-600">
            Bobot AHP: Harga 28% | Jarak 22% | Aman 22% | Fasilitas 18% | Bising
            10% (CR = {formatDecimal(dataset.metadata.consistencyRatio, 3)})
          </div>
        </div>
      </aside>

      {/* DESKTOP: Top Floating Map HUD Bar (3 Category Modes + 3-Column Board Trigger) */}
      <div className="pointer-events-none fixed left-[424px] right-5 top-5 z-20 hidden items-center justify-between gap-3 lg:flex">
        <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-slate-300 bg-white p-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => handleModeChange("keamanan")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
              mapMode === "keamanan"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            1. Paling Aman (C4)
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("kelayakan")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
              mapMode === "kelayakan"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            2. Layak / Tidak Layak
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("overall")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
              mapMode === "overall"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            3. Overall (Aman &amp; Layak)
          </button>
        </div>

        {!selectedZone && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 shadow-lg">
            <button
              type="button"
              onClick={() => setShowCategoryBoard(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-slate-800 cursor-pointer"
            >
              <Columns3 className="h-3.5 w-3.5" />
              <span>Tabel 3 Kolom</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectZone("A2", "keamanan")}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-100 cursor-pointer"
            >
              #1 Aman: A2 GKPN (4,2)
            </button>
            <button
              type="button"
              onClick={() => handleSelectZone("A1", "overall")}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-800 transition hover:bg-indigo-100 cursor-pointer"
            >
              #1 Overall: A1 Ciseke (0,7512)
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP: Bottom Legend Strip */}
      <div className="pointer-events-auto fixed bottom-5 left-[424px] z-20 hidden items-center gap-4 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[11px] shadow-lg lg:flex">
        {mapMode === "keamanan" ? (
          <>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              Aman (C4 &ge; 3,4)
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
              Kurang Aman (2,8 - 3,3)
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
              Tidak Aman (C4 &lt; 2,8)
            </span>
          </>
        ) : mapMode === "kelayakan" ? (
          <>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              Layak (Ciseke, Hegarmanah, Cikuda)
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
              Cukup Layak (GKPN)
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
              Tidak Layak (Sayang, Caringin)
            </span>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              Optimal (#1 Ciseke, #2 Hegarmanah)
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
              Kompromi (#3 Cikuda, #4 GKPN)
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
              Kurang Optimal (#5 Sayang, #6 Caringin)
            </span>
          </>
        )}
      </div>

      {/* DESKTOP: Bottom-Right Zoom Controls */}
      <div
        className={`pointer-events-auto fixed bottom-5 z-20 hidden flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg transition-all lg:flex ${
          selectedZone ? "right-[452px]" : "right-5"
        }`}
      >
        <button
          type="button"
          onClick={() => mapActionsRef.current?.zoomIn()}
          aria-label="Perbesar peta"
          className="flex h-10 w-11 items-center justify-center border-b border-slate-200 text-slate-900 hover:bg-slate-50 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => mapActionsRef.current?.zoomOut()}
          aria-label="Perkecil peta"
          className="flex h-10 w-11 items-center justify-center border-b border-slate-200 text-slate-900 hover:bg-slate-50 cursor-pointer"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedCode(null);
            mapActionsRef.current?.resetView();
          }}
          aria-label="Reset tampilan peta ke Jatinangor"
          className="flex h-10 w-11 items-center justify-center text-slate-900 hover:bg-slate-50 cursor-pointer"
        >
          <Home className="h-4 w-4" />
        </button>
      </div>

      {/* MOBILE: Top Bar & Mode/Filter Chips */}
      <div className="pointer-events-none fixed left-3 right-3 top-3 z-20 space-y-2 lg:hidden">
        <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-2xl bg-slate-900 px-3 py-2.5 text-white shadow-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <Shield className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold">JatinangorAman</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowCategoryBoard(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 cursor-pointer"
            >
              <Columns3 className="h-3.5 w-3.5" />
              <span>3 Kolom</span>
            </button>
            <button
              type="button"
              onClick={() => setShowMobileList((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-100 cursor-pointer"
            >
              <List className="h-3.5 w-3.5" />
              <span>Daftar</span>
            </button>
            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              aria-label="Info metodologi"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 cursor-pointer"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile 3-Mode Switcher */}
        <div className="pointer-events-auto flex gap-1.5 overflow-x-auto pb-1">
          {(
            [
              { key: "keamanan", label: "1. Paling Aman" },
              { key: "kelayakan", label: "2. Layak / Tidak" },
              { key: "overall", label: "3. Overall" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleModeChange(tab.key)}
              className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold shadow-sm cursor-pointer ${
                mapMode === tab.key
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE: Quick Kawasan List Drawer */}
      {showMobileList && (
        <div className="fixed inset-x-3 top-28 z-30 max-h-[60vh] space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl lg:hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-900">
              Pilih Kawasan ({filteredZones.length})
            </p>
            <button
              type="button"
              onClick={() => setShowMobileList(false)}
              className="text-slate-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {filteredZones.map((zone) => {
            const palette = getZonePaletteByMode(zone, mapMode);
            const badgeLabel = getZoneBadgeLabelByMode(zone, mapMode);
            return (
              <button
                key={zone.code}
                type="button"
                onClick={() => handleSelectZone(zone.code)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {zone.code} - {zone.name.split(" (")[0]}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Rp {formatDecimal(zone.metrics.c1_harga_juta)} jt | C4:{" "}
                    {formatDecimal(zone.metrics.c4_keamanan, 1)}/5 | Vi:{" "}
                    {formatDecimal(zone.topsisScore, 4)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${palette.badgeBg} ${palette.badgeText}`}
                >
                  {badgeLabel}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Detail Drawer (Desktop Right Panel / Mobile Bottom Sheet) */}
      {selectedZone && (
        <ZoneDetailDrawer
          zone={selectedZone}
          allZones={dataset.zones}
          criteria={dataset.criteria}
          mapMode={mapMode}
          onClose={() => setSelectedCode(null)}
          onSelectZone={(code) => handleSelectZone(code)}
        />
      )}

      {/* 3-Column Comparison Board Modal */}
      {showCategoryBoard && (
        <CategoryBoardModal
          zones={dataset.zones}
          selectedCode={selectedCode}
          onSelectZone={handleSelectZone}
          onClose={() => setShowCategoryBoard(false)}
        />
      )}

      {/* Methodology Modal */}
      {showInfoModal && (
        <MethodologyModal
          metadata={dataset.metadata}
          criteria={dataset.criteria}
          onClose={() => setShowInfoModal(false)}
        />
      )}
    </main>
  );
}
