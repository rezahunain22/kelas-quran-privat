import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { rataRataJuz, type JuzHafalan } from "@/data/laporanData";
import { cn } from "@/lib/utils";

interface HafalanSectionProps {
  hafalan: JuzHafalan[];
}

const lancarColor = (val: number) => {
  if (val === 0) return "bg-muted text-muted-foreground";
  if (val < 50) return "bg-orange-100 text-orange-700";
  if (val < 80) return "bg-amber-100 text-amber-700";
  if (val < 100) return "bg-emerald-100 text-emerald-700";
  return "bg-primary text-primary-foreground";
};

const statusLabel = (val: number) => {
  if (val === 0) return "Belum";
  if (val < 50) return "Mulai";
  if (val < 80) return "Lancar";
  if (val < 100) return "Hampir Mutqin";
  return "Mutqin";
};

export const HafalanSection = ({ hafalan }: HafalanSectionProps) => {
  // Default: hanya juz yang punya progres yang terbuka
  const initialOpen = new Set(
    hafalan.filter((j) => rataRataJuz(j) > 0).map((j) => j.nomor),
  );
  const [open, setOpen] = useState<Set<number>>(initialOpen);

  const toggle = (n: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {hafalan
        .slice()
        .reverse() // Juz 30 di atas
        .map((juz) => {
          const rata = rataRataJuz(juz);
          const isOpen = open.has(juz.nomor);
          const isEmpty = juz.surat.length === 0;

          return (
            <div
              key={juz.nomor}
              className="rounded-2xl border bg-card overflow-hidden transition-shadow hover:shadow-sm"
            >
              <button
                type="button"
                onClick={() => !isEmpty && toggle(juz.nomor)}
                disabled={isEmpty}
                className={cn(
                  "flex w-full items-center gap-3 p-4 text-left transition-colors",
                  !isEmpty && "hover:bg-muted/40",
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold",
                    rata > 0
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {juz.nomor}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm sm:text-base">
                      Juz {juz.nomor}
                    </h4>
                    {isEmpty ? (
                      <span className="text-xs text-muted-foreground">
                        Belum dipelajari
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {juz.surat.length} surat • rata-rata {rata}%
                      </span>
                    )}
                  </div>
                  {!isEmpty && (
                    <Progress value={rata} className="h-1.5 mt-2" />
                  )}
                </div>
                {!isEmpty && (
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform shrink-0",
                      isOpen && "rotate-180",
                    )}
                  />
                )}
              </button>

              {isOpen && !isEmpty && (
                <div className="border-t bg-muted/20 p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {juz.surat.map((s) => (
                      <div
                        key={s.nomor}
                        className="flex items-center gap-3 rounded-xl bg-background p-3 border"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary text-xs font-semibold">
                          {s.nomor}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-sm truncate">
                              {s.nama}
                            </p>
                            <span
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
                                lancarColor(s.kelancaran),
                              )}
                            >
                              {statusLabel(s.kelancaran)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={s.kelancaran} className="h-1 flex-1" />
                            <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-right">
                              {s.kelancaran}%
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <BookOpen className="h-2.5 w-2.5" />
                            {s.ayat} ayat
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
