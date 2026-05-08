import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CatatanText } from "./CatatanText";

export interface MakhrajItem {
  id?: string;
  urutan: number;
  huruf: string;
  nama_huruf: string;
  kelancaran: number;
  catatan_perbaikan: string;
}

const colorFor = (v: number) => {
  if (v >= 85) return "hsl(125, 52%, 38%)";
  if (v >= 60) return "hsl(35, 85%, 50%)";
  if (v > 0) return "hsl(0, 70%, 55%)";
  return "hsl(var(--muted-foreground))";
};

export const MakhrajSection = ({ items }: { items: MakhrajItem[] }) => {
  const [active, setActive] = useState<MakhrajItem | null>(null);

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Data makhraj belum tersedia.
      </p>
    );
  }

  const rata = Math.round(items.reduce((s, x) => s + x.kelancaran, 0) / items.length);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">
          Klik tiap huruf untuk melihat catatan perbaikan dari pengajar.
        </p>
        <div className="text-sm">
          Rata-rata penguasaan:{" "}
          <span className="font-semibold tabular-nums" style={{ color: colorFor(rata) }}>
            {rata}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-2.5">
        {items
          .slice()
          .sort((a, b) => a.urutan - b.urutan)
          .map((it) => {
            const isActive = active?.urutan === it.urutan;
            return (
              <button
                key={it.urutan}
                onClick={() => setActive(isActive ? null : it)}
                className={cn(
                  "group relative aspect-square rounded-2xl border bg-card flex flex-col items-center justify-center p-1.5 transition-all hover:shadow-md hover:-translate-y-0.5",
                  isActive && "ring-2 ring-primary border-primary shadow-md",
                )}
              >
                <span
                  className="text-3xl sm:text-4xl leading-none font-arabic"
                  style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                >
                  {it.huruf}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 truncate max-w-full">
                  {it.nama_huruf}
                </span>
                <span
                  className="mt-1 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full"
                  style={{ color: colorFor(it.kelancaran), backgroundColor: `${colorFor(it.kelancaran)}1A` }}
                >
                  {it.kelancaran}%
                </span>
                <div className="absolute bottom-0 left-1.5 right-1.5 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${it.kelancaran}%`, backgroundColor: colorFor(it.kelancaran) }}
                  />
                </div>
              </button>
            );
          })}
      </div>

      {active && (
        <Card className="rounded-2xl p-4 sm:p-5 border-primary/30 bg-primary/5">
          <div className="flex items-start gap-4">
            <div
              className="text-5xl sm:text-6xl leading-none shrink-0"
              style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
            >
              {active.huruf}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h4 className="font-semibold">{active.nama_huruf}</h4>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: colorFor(active.kelancaran) }}
                >
                  Penguasaan {active.kelancaran}%
                </span>
              </div>
             {active.catatan_perbaikan?.trim() ? (
                <CatatanText text={active.catatan_perbaikan} className="text-sm text-muted-foreground mt-2 space-y-2" />
              ) : (
                <p className="text-sm text-muted-foreground mt-2">Belum ada catatan perbaikan.</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
