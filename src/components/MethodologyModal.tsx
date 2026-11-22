"use client";

import { useEffect } from "react";
import { Shield, X } from "lucide-react";
import { CriterionSpec, DatasetMetadata, formatDecimal } from "@/lib/zones";

interface MethodologyModalProps {
  metadata: DatasetMetadata;
  criteria: CriterionSpec[];
  onClose: () => void;
}

export default function MethodologyModal({
  metadata,
  criteria,
  onClose,
}: MethodologyModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="methodology-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <Shield className="h-4 w-4" />
            </span>
            <div>
              <h2 id="methodology-title" className="text-sm font-bold">
                Metodologi Model DSS Jatinangor
              </h2>
              <p className="text-[11px] text-slate-300">
                {metadata.method} | CR ={" "}
                {formatDecimal(metadata.consistencyRatio, 3)} |{" "}
                {metadata.sampleSize} Responden Simulasi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal metodologi"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/70 text-slate-200 transition hover:bg-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5 text-xs text-slate-700">
          <div>
            <p className="font-semibold text-slate-900">Sumber Paper:</p>
            <p className="mt-0.5 leading-relaxed text-slate-600">
              {metadata.sourcePaper}
            </p>
          </div>

          <div>
            <p className="mb-1.5 font-semibold text-slate-900">
              Kriteria & Bobot AHP (CR &le; 0,10):
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Kode</th>
                    <th className="px-3 py-2 font-semibold">Kriteria</th>
                    <th className="px-3 py-2 font-semibold">Tipe</th>
                    <th className="px-3 py-2 text-right font-semibold">Bobot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {criteria.map((c) => (
                    <tr key={c.code}>
                      <td className="px-3 py-1.5 font-bold text-slate-900">
                        {c.code}
                      </td>
                      <td className="px-3 py-1.5">{c.name}</td>
                      <td className="px-3 py-1.5 capitalize">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            c.type === "benefit"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {c.type}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-right font-bold text-slate-900">
                        {Math.round(c.ahpWeight * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="font-semibold text-slate-900">
              Aturan Zona Keamanan (C4) & Catatan Trade-off:
            </p>
            <ul className="mt-1 space-y-1 text-[11px] text-slate-600">
              <li>
                <strong className="text-emerald-700">Aman (C4 &ge; 3,4):</strong>{" "}
                GKPN & Kolocokro, Caringin.
              </li>
              <li>
                <strong className="text-amber-700">
                  Kurang Aman (2,8 - 3,3):
                </strong>{" "}
                Sayang, Hegarmanah, Cikuda.
              </li>
              <li>
                <strong className="text-red-700">Tidak Aman (C4 &lt; 2,8):</strong>{" "}
                Ciseke.
              </li>
            </ul>
            <p className="mt-2 border-t border-slate-200 pt-2 text-[11px] leading-relaxed text-slate-600">
              {metadata.note}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
