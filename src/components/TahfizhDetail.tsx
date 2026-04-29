import { Check, Mic, BookOpen, RefreshCw } from "lucide-react";

const items = [
  { icon: Mic, text: "VN setiap Senin - Jum'at" },
  { icon: BookOpen, text: "Ziyadah minimal 1 ayat per hari" },
  { icon: Check, text: "Mendapatkan feedback bacaan" },
  { icon: RefreshCw, text: "1x pertemuan online per minggu (fleksibel)" },
];

const focuses = ["Muroja'ah", "Ziyadah", "Tahsin"];

const TahfizhDetail = () => {
  return (
    <section id="tahfizh" className="py-20 md:py-28 bg-secondary relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />

      <div className="container max-w-4xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
            Detail Program
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Program Tahfizh
          </h2>
          <p className="text-muted-foreground">
            Sistem bimbingan yang terstruktur dan fleksibel
          </p>
        </div>

        <div className="rounded-3xl bg-card border p-6 sm:p-8 md:p-10 shadow-[var(--shadow-card)]">
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {items.map((item) => (
              <div
                key={item.text}
                className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/50 border border-border/50"
              >
                <span className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </span>
                <span className="text-foreground text-sm leading-relaxed pt-2">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <p className="font-semibold text-foreground mb-4 text-center sm:text-left">
              Fokus Pembelajaran:
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              {focuses.map((f) => (
                <span
                  key={f}
                  className="px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TahfizhDetail;
