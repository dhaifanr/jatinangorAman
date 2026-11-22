"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import {
  CAMPUS_LANDMARKS,
  JATINANGOR_CENTER,
  JATINANGOR_DEFAULT_ZOOM,
  MapMode,
  ZoneData,
  escapeHtml,
  formatDecimal,
  getStatusPalette,
  getTopsisPalette,
} from "@/lib/zones";

export interface MapActions {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
}

interface JatinangorMapProps {
  zones: ZoneData[];
  selectedZone: ZoneData | null;
  mapMode: MapMode;
  onSelectZone: (code: string) => void;
  mapActionsRef: React.MutableRefObject<MapActions | null>;
}

const TILE_SOURCES: Array<{ url: string; options: L.TileLayerOptions }> = [
  {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    },
  },
  {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    options: {
      attribution: "Tiles &copy; Esri",
      maxZoom: 19,
    },
  },
];

export default function JatinangorMap({
  zones,
  selectedZone,
  mapMode,
  onSelectZone,
  mapActionsRef,
}: JatinangorMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const landmarksLayerRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelectZone);

  useEffect(() => {
    onSelectRef.current = onSelectZone;
  }, [onSelectZone]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      center: JATINANGOR_CENTER,
      zoom: JATINANGOR_DEFAULT_ZOOM,
      zoomControl: false,
      minZoom: 12,
      maxZoom: 18,
    });

    let activeTileIdx = 0;
    let tileErrors = 0;
    let activeTileLayer: L.TileLayer | null = null;

    const mountTileLayer = (index: number) => {
      if (activeTileLayer) {
        map.removeLayer(activeTileLayer);
      }
      const source = TILE_SOURCES[index];
      const layer = L.tileLayer(source.url, source.options);
      layer.on("tileerror", () => {
        tileErrors += 1;
        if (tileErrors > 2 && activeTileIdx + 1 < TILE_SOURCES.length) {
          activeTileIdx += 1;
          tileErrors = 0;
          console.warn(
            "[JatinangorMap] Primary tile host unavailable, switching to backup tiles."
          );
          mountTileLayer(activeTileIdx);
        }
      });
      layer.addTo(map);
      activeTileLayer = layer;
    };

    mountTileLayer(0);

    const zonesLayer = L.layerGroup().addTo(map);
    const landmarksLayer = L.layerGroup().addTo(map);

    CAMPUS_LANDMARKS.forEach((landmark) => {
      const safeName = escapeHtml(landmark.name);
      const icon = L.divIcon({
        className: "ja-div-icon",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        html: `<div style="transform:translate(-50%,-50%);display:inline-flex;align-items:center;padding:3px 9px;border-radius:8px;background:#1E293B;color:#FFFFFF;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(15,23,42,0.28);border:1px solid #334155;">${safeName}</div>`,
      });
      L.marker([landmark.lat, landmark.lng], { icon, interactive: false }).addTo(
        landmarksLayer
      );
    });

    mapRef.current = map;
    zonesLayerRef.current = zonesLayer;
    landmarksLayerRef.current = landmarksLayer;

    mapActionsRef.current = {
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      resetView: () =>
        map.flyTo(JATINANGOR_CENTER, JATINANGOR_DEFAULT_ZOOM, { duration: 0.5 }),
    };

    // Ensure Leaflet recalculates dimensions once Next.js dynamic container settles
    const rafId = window.requestAnimationFrame(() => {
      map.invalidateSize();
    });

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      mapActionsRef.current = null;
      map.remove();
      mapRef.current = null;
      zonesLayerRef.current = null;
      landmarksLayerRef.current = null;
    };
  }, [mapActionsRef]);

  useEffect(() => {
    const layerGroup = zonesLayerRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    zones.forEach((zone) => {
      const isSelected = selectedZone?.code === zone.code;
      const hasSelection = selectedZone !== null;

      const palette = getStatusPalette(zone.zoneStatus);
      const topsisColors = getTopsisPalette(zone.topsisRank);

      const strokeColor =
        mapMode === "keamanan" ? palette.stroke : topsisColors.stroke;
      const fillColor = mapMode === "keamanan" ? palette.fill : topsisColors.fill;

      const fillOpacity = isSelected ? 0.44 : hasSelection ? 0.14 : 0.28;
      const weight = isSelected ? 3.5 : 2;

      const polygon = L.polygon(zone.polygon, {
        color: strokeColor,
        weight,
        fillColor,
        fillOpacity,
      });

      polygon.on("click", () => {
        onSelectRef.current(zone.code);
      });

      polygon.addTo(layerGroup);

      const shortName = zone.name.split(" (")[0];
      const metricLine =
        mapMode === "keamanan"
          ? `C4: ${formatDecimal(zone.metrics.c4_keamanan, 1)} | Rank #${zone.topsisRank}`
          : `Vi: ${formatDecimal(zone.topsisScore, 4)} | #${zone.topsisRank}`;
      const subTextColor =
        mapMode === "keamanan" ? palette.stroke : topsisColors.textHex;

      const safeCode = escapeHtml(zone.code);
      const safeName = escapeHtml(shortName);
      const safeMetric = escapeHtml(metricLine);

      const borderWidth = isSelected ? "2px" : "1.5px";
      const opacityStyle = hasSelection && !isSelected ? "opacity:0.76;" : "";

      const calloutIcon = L.divIcon({
        className: "ja-div-icon",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        html: `<button type="button" style="transform:translate(-50%,-50%);cursor:pointer;display:inline-flex;align-items:center;gap:7px;padding:5px 10px 5px 7px;border-radius:12px;background:#FFFFFF;border:${borderWidth} solid ${strokeColor};box-shadow:0 4px 14px rgba(15,23,42,0.16);white-space:nowrap;text-align:left;${opacityStyle}">
          <span style="display:inline-flex;align-items:center;justify-content:center;padding:3px 7px;border-radius:7px;background:${fillColor};color:#FFFFFF;font-size:11px;font-weight:800;line-height:1;">${safeCode}</span>
          <span style="display:flex;flex-direction:column;gap:1px;line-height:1.15;">
            <span style="color:#0F172A;font-size:11.5px;font-weight:700;">${safeName}</span>
            <span style="color:${subTextColor};font-size:10px;font-weight:600;">${safeMetric}</span>
          </span>
        </button>`,
      });

      const marker = L.marker([zone.centerApprox.lat, zone.centerApprox.lng], {
        icon: calloutIcon,
        zIndexOffset: isSelected ? 500 : 100,
      });

      marker.on("click", () => {
        onSelectRef.current(zone.code);
      });

      marker.addTo(layerGroup);
    });
  }, [zones, selectedZone, mapMode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedZone) return;

    map.flyTo(
      [selectedZone.centerApprox.lat, selectedZone.centerApprox.lng],
      15,
      { duration: 0.55 }
    );
  }, [selectedZone]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 h-full w-full"
      aria-label="Peta interaktif zona keamanan kos di Jatinangor"
    />
  );
}
