"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import {
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
  JatinangorDataset,
  MapMode,
  ZoneStatus,
  filterZones,
  formatDecimal,
  getStatusPalette,
} from "@/lib/zones";
import type { MapActions } from "./JatinangorMap";
import ZoneDetailDrawer from "./ZoneDetailDrawer";
import MethodologyModal from "./MethodologyModal";

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
  const [statusFilter, setStatusFilter] = useState<ZoneStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapMode, setMapMode] = useState<MapMode>("keamanan");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);

  const mapActionsRef = useRef<MapActions | null>(null);

  const counts = useMemo(() => {
    return {
      all: dataset.zones.length,
      aman: dataset.zones.filter((z) => z.zoneStatus === "aman").length,
      kurang_aman: dataset.zones.filter((z) => z.zoneStatus === "kurang_aman")
        .length,
      tidak_aman: dataset.zones.filter((z) => z.zoneStatus === "tidak_aman")
        .length,
    };
  }, [dataset.zones]);

  const filteredZones = useMemo(
    () => filterZones(dataset.zones, statusFilter, searchQuery),
    [dataset.zones, statusFilter, searchQuery]
  );

  const selectedZone = useMemo(
    () => dataset.zones.find((z) => z.code === selectedCode) ?? null,
    [dataset.zones, selectedCode]
  );

  const handleSelectZone = (code: string) => {
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
        onSelectZone={handleSelectZone}
        mapActionsRef={mapActionsRef}
      />

      {/* DESKTOP: Floating Left Control Panel */}
      <aside
        aria-label="Panel kontrol dan daftar kawasan"
        className="pointer-events-auto fixed bottom-5 left-5 top-5 z-20 hidden w-[376px] flex-col overflow-hidden rounded-[18px] border border-slate-300 bg-white shadow-2xl lg:flex"
      >
        {/* Dark Navy Gradient Hero Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-[18px] pb-4 pt-[18px]">
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
                  Smart Living &amp; Safety | AHP-TOPSIS
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

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-emerald-950 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
              {counts.aman} Aman
            </span>
            <span className="rounded-lg bg-amber-950 px-2.5 py-1 text-[11px] font-bold text-amber-400">
              {counts.kurang_aman} Kurang Aman
            </span>
            <span className="rounded-lg bg-red-950 px-2.5 py-1 text-[11px] font-bold text-red-300">
              {counts.tidak_aman} Tidak Aman
            </span>
          </div>
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
            {(
              [
                { key: "all", label: `Semua (${counts.all})`, active: "bg-slate-900 text-white border-slate-900", idle: "bg-slate-50 text-slate-700 border-slate-200" },
                { key: "aman", label: `Aman (${counts.aman})`, active: "bg-emerald-600 text-white border-emerald-600", idle: "bg-emerald-50 text-emerald-800 border-emerald-200" },
                { key: "kurang_aman", label: `Kurang (${counts.kurang_aman})`, active: "bg-amber-500 text-white border-amber-500", idle: "bg-amber-50 text-amber-800 border-amber-200" },
                { key: "tidak_aman", label: `Tidak (${counts.tidak_aman})`, active: "bg-red-600 text-white border-red-600", idle: "bg-red-50 text-red-800 border-red-200" },
              ] as const
            ).map((chip) => {
              const isSelected = statusFilter === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => setStatusFilter(chip.key)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                    isSelected ? chip.active : chip.idle
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[10px] font-bold tracking-wider text-slate-500">
            {filteredZones.length} KAWASAN EVALUASI ({dataset.metadata.sampleSize}{" "}
            RESPONDEN)
          </p>

          {/* Kawasan Cards List */}
          <div className="mt-2 flex-1 space-y-2 overflow-y-auto pr-0.5">
            {filteredZones.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500">
                Kawasan tidak ditemukan.
              </div>
            ) : (
              filteredZones.map((zone) => {
                const palette = getStatusPalette(zone.zoneStatus);
                const isSelected = selectedCode === zone.code;
                const c4WidthPct = Math.round((zone.metrics.c4_keamanan / 5) * 100);

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
                          {zone.code} - {zone.name.split(" (")[0]}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${palette.badgeBg} ${palette.badgeText}`}
                        >
                          {zone.zoneLabel}
                        </span>
                      </div>

                      <p className="mt-0.5 text-[11px] font-medium text-slate-600">
                        Rp {formatDecimal(zone.metrics.c1_harga_juta)} jt/thn |{" "}
                        {formatDecimal(zone.metrics.c2_jarak_km)} km | Rank #
                        {zone.topsisRank}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold text-slate-700">
                          Keamanan C4: {formatDecimal(zone.metrics.c4_keamanan, 1)}
                          /5
                        </span>
                        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${c4WidthPct}%`,
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

      {/* DESKTOP: Top Floating Map HUD Bar */}
      <div className="pointer-events-none fixed left-[416px] right-5 top-5 z-20 hidden items-center justify-between gap-3 lg:flex">
        <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-slate-300 bg-white p-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => setMapMode("keamanan")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
              mapMode === "keamanan"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Mode: Zona Keamanan (C4)
          </button>
          <button
            type="button"
            onClick={() => setMapMode("topsis")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
              mapMode === "topsis"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Mode: Kelayakan TOPSIS (Vi)
          </button>
        </div>

        {!selectedZone && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 shadow-lg">
            <button
              type="button"
              onClick={() => handleSelectZone("A2")}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-100 cursor-pointer"
            >
              Paling Aman: A2 GKPN (3,6/5)
            </button>
            <button
              type="button"
              onClick={() => handleSelectZone("A4")}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-800 transition hover:bg-indigo-100 cursor-pointer"
            >
              Rank #1 TOPSIS: A4 Cikuda (0,7355)
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP: Bottom Legend Strip */}
      <div className="pointer-events-auto fixed bottom-5 left-[416px] z-20 hidden items-center gap-4 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[11px] shadow-lg lg:flex">
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
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
              Peringkat #1 - #2
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-sky-400" />
              Peringkat #3 - #4
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-400" />
              Peringkat #5 - #6
            </span>
          </>
        )}
        {!selectedZone && (
          <>
            <span className="h-4 w-px bg-slate-300" />
            <span className="font-medium text-slate-500">
              30 Responden Simulasi (Paper DSS)
            </span>
          </>
        )}
      </div>

      {/* DESKTOP: Bottom-Right Zoom Controls */}
      <div
        className={`pointer-events-auto fixed bottom-5 z-20 hidden flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg transition-all lg:flex ${
          selectedZone ? "right-[444px]" : "right-5"
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

      {/* MOBILE: Top Bar & Filter Chips */}
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

        <div className="pointer-events-auto flex gap-1.5 overflow-x-auto pb-1">
          {(
            [
              { key: "all", label: `Semua (${counts.all})` },
              { key: "aman", label: `Aman (${counts.aman})` },
              { key: "kurang_aman", label: `Kurang (${counts.kurang_aman})` },
              { key: "tidak_aman", label: `Tidak (${counts.tidak_aman})` },
            ] as const
          ).map((chip) => {
            const isSelected = statusFilter === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setStatusFilter(chip.key)}
                className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold shadow-sm cursor-pointer ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
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
            const palette = getStatusPalette(zone.zoneStatus);
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
                    C4: {formatDecimal(zone.metrics.c4_keamanan, 1)}/5 | Rank #
                    {zone.topsisRank}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${palette.badgeBg} ${palette.badgeText}`}
                >
                  {zone.zoneLabel}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* MOBILE: Compact Bottom Legend when no zone selected */}
      {!selectedZone && !showMobileList && (
        <div className="pointer-events-auto fixed bottom-4 left-3 right-3 z-20 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-[11px] font-semibold shadow-lg lg:hidden">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            Aman
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
            Kurang Aman
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
            Tidak Aman
          </span>
        </div>
      )}

      {/* Detail Drawer (Desktop Right Panel / Mobile Bottom Sheet) */}
      {selectedZone && (
        <ZoneDetailDrawer
          zone={selectedZone}
          allZones={dataset.zones}
          criteria={dataset.criteria}
          onClose={() => setSelectedCode(null)}
          onSelectZone={handleSelectZone}
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
